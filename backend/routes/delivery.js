import express from 'express';
import DeliveryPerson from '../models/DeliveryPerson.js';
import Order from '../models/Order.js';
import { authMiddleware, deliveryOnly } from '../middleware/auth.js';

const router = express.Router();

// S'inscrire comme livreur
router.post('/register', async (req, res) => {
  try {
    const deliveryData = {
      ...req.body,
      accountStatus: 'pending' // En attente d'approbation
    };

    const deliveryPerson = new DeliveryPerson(deliveryData);
    await deliveryPerson.save();

    res.status(201).json({
      message: 'Inscription en tant que livreur soumise. En attente d\'approbation.',
      deliveryPersonId: deliveryPerson._id
    });

  } catch (error) {
    console.error('Erreur inscription livreur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Mettre à jour la localisation du livreur
router.post('/update-location', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    await DeliveryPerson.findByIdAndUpdate(req.user.userId, {
      currentLocation: {
        type: 'Point',
        coordinates: [longitude, latitude],
        lastUpdated: new Date(),
        accuracy
      },
      lastLocationUpdate: new Date()
    });

    // Émettre la nouvelle position via Socket.IO si en cours de livraison
    const deliveryPerson = await DeliveryPerson.findById(req.user.userId);
    if (deliveryPerson.currentOrder) {
      req.app.get('io').to(`order_${deliveryPerson.currentOrder}`).emit('deliveryLocationUpdate', {
        orderId: deliveryPerson.currentOrder,
        location: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      });
    }

    res.json({ message: 'Localisation mise à jour' });

  } catch (error) {
    console.error('Erreur mise à jour localisation:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la localisation' });
  }
});

// Changer le statut de disponibilité
router.post('/toggle-availability', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const { isOnline, isAvailable } = req.body;

    const updateData = {};
    if (typeof isOnline !== 'undefined') updateData['availability.isOnline'] = isOnline;
    if (typeof isAvailable !== 'undefined') updateData['availability.isAvailable'] = isAvailable;
    
    updateData.lastSeen = new Date();

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Statut de disponibilité mis à jour',
      availability: deliveryPerson.availability
    });

  } catch (error) {
    console.error('Erreur mise à jour disponibilité:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la disponibilité' });
  }
});

// Obtenir les commandes disponibles pour livraison
router.get('/available-orders', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(req.user.userId);
    
    if (!deliveryPerson.availability.isOnline || !deliveryPerson.availability.isAvailable) {
      return res.json({ orders: [], message: 'Vous devez être en ligne et disponible' });
    }

    // Chercher des commandes dans les zones de travail du livreur
    const availableOrders = await Order.find({
      status: 'ready',
      deliveryPerson: null,
      'deliveryAddress.coordinates': {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: deliveryPerson.workingZones
          }
        }
      }
    })
    .populate('customer', 'firstName lastName phone')
    .populate('items.vendor', 'businessName location phone')
    .sort({ createdAt: 1 })
    .limit(10);

    // Calculer la distance pour chaque commande
    const ordersWithDistance = availableOrders.map(order => {
      const distance = calculateDistance(
        deliveryPerson.currentLocation.coordinates,
        order.deliveryAddress.coordinates.coordinates
      );
      
      return {
        ...order.toObject(),
        estimatedDistance: Math.round(distance * 100) / 100, // km
        estimatedEarnings: Math.round(order.pricing.deliveryFee * 0.8) // 80% pour le livreur
      };
    });

    res.json({
      orders: ordersWithDistance,
      count: ordersWithDistance.length
    });

  } catch (error) {
    console.error('Erreur récupération commandes disponibles:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
});

// Accepter une commande
router.post('/accept-order/:orderId', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Vérifier que le livreur est disponible
    const deliveryPerson = await DeliveryPerson.findById(req.user.userId);
    if (!deliveryPerson.availability.isAvailable || deliveryPerson.currentOrder) {
      return res.status(400).json({ message: 'Vous n\'êtes pas disponible pour accepter une commande' });
    }

    // Vérifier que la commande est disponible
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'ready' || order.deliveryPerson) {
      return res.status(400).json({ message: 'Commande non disponible' });
    }

    // Assigner la commande
    order.deliveryPerson = req.user.userId;
    order.status = 'assigned';
    order.assignedAt = new Date();
    await order.save();

    // Mettre à jour le livreur
    deliveryPerson.currentOrder = orderId;
    deliveryPerson.availability.isAvailable = false;
    await deliveryPerson.save();

    // Notifier le client
    req.app.get('io').to(`order_${orderId}`).emit('orderStatusUpdate', {
      orderId,
      status: 'assigned',
      deliveryPerson: {
        name: `${deliveryPerson.firstName} ${deliveryPerson.lastName}`,
        phone: deliveryPerson.phone,
        vehicle: deliveryPerson.vehicle.type
      }
    });

    res.json({
      message: 'Commande acceptée avec succès',
      order: {
        id: order._id,
        status: order.status,
        customer: order.customer,
        deliveryAddress: order.deliveryAddress
      }
    });

  } catch (error) {
    console.error('Erreur acceptation commande:', error);
    res.status(500).json({ message: 'Erreur lors de l\'acceptation de la commande' });
  }
});

// Obtenir les détails de la commande en cours
router.get('/current-order', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(req.user.userId);
    
    if (!deliveryPerson.currentOrder) {
      return res.json({ order: null, message: 'Aucune commande en cours' });
    }

    const order = await Order.findById(deliveryPerson.currentOrder)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name images')
      .populate('items.vendor', 'businessName location phone');

    res.json({ order });

  } catch (error) {
    console.error('Erreur récupération commande courante:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande courante' });
  }
});

// Marquer comme récupéré chez le vendeur
router.post('/pickup-order/:orderId', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pickupCode } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.deliveryPerson.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Commande non trouvée ou non assignée' });
    }

    // TODO: Vérifier le code de récupération avec le vendeur
    
    order.status = 'picked_up';
    order.pickedUpAt = new Date();
    order.tracking.push({
      status: 'picked_up',
      timestamp: new Date(),
      note: 'Commande récupérée chez le vendeur'
    });

    await order.save();

    // Notifier le client
    req.app.get('io').to(`order_${orderId}`).emit('orderStatusUpdate', {
      orderId,
      status: 'picked_up',
      timestamp: new Date()
    });

    res.json({ message: 'Commande marquée comme récupérée' });

  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

// Marquer comme en transit
router.post('/start-delivery/:orderId', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order || order.deliveryPerson.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Commande non trouvée ou non assignée' });
    }

    order.status = 'in_transit';
    order.tracking.push({
      status: 'in_transit',
      timestamp: new Date(),
      note: 'Livraison en cours'
    });

    await order.save();

    // Notifier le client
    req.app.get('io').to(`order_${orderId}`).emit('orderStatusUpdate', {
      orderId,
      status: 'in_transit',
      timestamp: new Date()
    });

    res.json({ message: 'Livraison démarrée' });

  } catch (error) {
    console.error('Erreur démarrage livraison:', error);
    res.status(500).json({ message: 'Erreur lors du démarrage de la livraison' });
  }
});

// Marquer comme livré
router.post('/complete-delivery/:orderId', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryCode, photo } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.deliveryPerson.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Commande non trouvée ou non assignée' });
    }

    // TODO: Vérifier le code de livraison avec le client
    
    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.deliveryProof = {
      photo,
      code: deliveryCode,
      timestamp: new Date()
    };

    await order.save();

    // Libérer le livreur
    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(req.user.userId, {
      currentOrder: null,
      'availability.isAvailable': true,
      $inc: { 'stats.completedDeliveries': 1 }
    });

    // Notifier le client
    req.app.get('io').to(`order_${orderId}`).emit('orderStatusUpdate', {
      orderId,
      status: 'delivered',
      timestamp: new Date()
    });

    res.json({ 
      message: 'Livraison terminée avec succès',
      earnings: Math.round(order.pricing.deliveryFee * 0.8)
    });

  } catch (error) {
    console.error('Erreur finalisation livraison:', error);
    res.status(500).json({ message: 'Erreur lors de la finalisation de la livraison' });
  }
});

// Statistiques du livreur
router.get('/stats', authMiddleware, deliveryOnly, async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(req.user.userId);
    
    // Statistiques de la journée
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.countDocuments({
      deliveryPerson: req.user.userId,
      deliveredAt: { $gte: today }
    });

    const todayEarnings = await Order.aggregate([
      {
        $match: {
          deliveryPerson: req.user.userId,
          deliveredAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$pricing.deliveryFee', 0.8] } }
        }
      }
    ]);

    res.json({
      today: {
        deliveries: todayOrders,
        earnings: Math.round(todayEarnings[0]?.total || 0)
      },
      overall: {
        totalDeliveries: deliveryPerson.stats.totalDeliveries,
        completedDeliveries: deliveryPerson.stats.completedDeliveries,
        totalEarnings: deliveryPerson.stats.totalEarnings,
        averageRating: deliveryPerson.stats.averageRating,
        successRate: deliveryPerson.stats.successRate
      },
      status: {
        isOnline: deliveryPerson.availability.isOnline,
        isAvailable: deliveryPerson.availability.isAvailable,
        hasCurrentOrder: !!deliveryPerson.currentOrder
      }
    });

  } catch (error) {
    console.error('Erreur statistiques livreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// Fonction utilitaire pour calculer la distance
function calculateDistance(coords1, coords2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
  const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;