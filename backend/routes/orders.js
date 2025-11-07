import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import DeliveryPerson from '../models/DeliveryPerson.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Créer une nouvelle commande
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      scheduledDelivery
    } = req.body;

    // Valider les produits et calculer le total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('vendor');
      
      if (!product) {
        return res.status(400).json({ message: `Produit ${item.productId} non trouvé` });
      }

      if (!product.availability.inStock || product.availability.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour ${product.name}` 
        });
      }

      const itemTotal = product.pricing.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        vendor: product.vendor._id,
        name: product.name,
        price: product.pricing.price,
        quantity: item.quantity,
        total: itemTotal,
        image: product.images[0] || ''
      });
    }

    // Calculer les frais de livraison (simulation)
    const deliveryFee = totalAmount > 10000 ? 0 : 1000; // Livraison gratuite > 10,000 FCFA
    const serviceFee = Math.round(totalAmount * 0.02); // 2% de frais de service
    const finalAmount = totalAmount + deliveryFee + serviceFee;

    // Créer la commande
    const order = new Order({
      customer: req.user.userId,
      items: orderItems,
      pricing: {
        subtotal: totalAmount,
        deliveryFee,
        serviceFee,
        discount: 0,
        total: finalAmount
      },
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      scheduledDelivery: scheduledDelivery ? new Date(scheduledDelivery) : undefined,
      status: 'pending'
    });

    await order.save();

    // Mettre à jour le stock des produits
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 'availability.quantity': -item.quantity }
      });
    }

    // Populer les données pour la réponse
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images')
      .populate('items.vendor', 'businessName phone')
      .populate('customer', 'firstName lastName phone');

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la commande' });
  }
});

// Obtenir les commandes de l'utilisateur
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    
    if (req.user.userType === 'customer') {
      filter.customer = req.user.userId;
    } else if (req.user.userType === 'vendor') {
      filter['items.vendor'] = req.user.userId;
    } else if (req.user.userType === 'delivery') {
      filter.deliveryPerson = req.user.userId;
    }

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name images')
      .populate('items.vendor', 'businessName phone')
      .populate('deliveryPerson', 'firstName lastName phone vehicle.type')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: orders.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
});

// Obtenir une commande par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name images description')
      .populate('items.vendor', 'businessName phone location')
      .populate('deliveryPerson', 'firstName lastName phone vehicle');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier les permissions
    const hasAccess = 
      order.customer._id.toString() === req.user.userId ||
      order.items.some(item => item.vendor._id.toString() === req.user.userId) ||
      (order.deliveryPerson && order.deliveryPerson._id.toString() === req.user.userId) ||
      req.user.userType === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(order);

  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

// Mettre à jour le statut d'une commande
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier les permissions selon le statut
    const hasPermission = 
      (req.user.userType === 'vendor' && 
       order.items.some(item => item.vendor.toString() === req.user.userId) &&
       ['confirmed', 'preparing', 'ready'].includes(status)) ||
      (req.user.userType === 'delivery' && 
       order.deliveryPerson?.toString() === req.user.userId &&
       ['picked_up', 'in_transit', 'delivered'].includes(status)) ||
      (req.user.userType === 'customer' && 
       order.customer.toString() === req.user.userId &&
       ['cancelled'].includes(status)) ||
      req.user.userType === 'admin';

    if (!hasPermission) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce statut' });
    }

    // Mettre à jour le statut
    order.status = status;
    order.updatedAt = new Date();

    // Ajouter une note au tracking
    if (note) {
      order.tracking.push({
        status,
        timestamp: new Date(),
        location: req.body.location,
        note
      });
    }

    // Actions spécifiques selon le statut
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      
      // Mettre à jour les statistiques du livreur
      if (order.deliveryPerson) {
        await DeliveryPerson.findByIdAndUpdate(order.deliveryPerson, {
          $inc: { 
            'stats.completedDeliveries': 1,
            'stats.totalEarnings': order.pricing.deliveryFee * 0.8 // 80% pour le livreur
          },
          currentOrder: null
        });
      }

      // Mettre à jour les statistiques des vendeurs
      for (const item of order.items) {
        await Vendor.findByIdAndUpdate(item.vendor, {
          $inc: { 
            'stats.totalOrders': 1,
            'stats.totalRevenue': item.total
          }
        });
      }
    }

    if (status === 'cancelled') {
      // Remettre en stock les produits
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'availability.quantity': item.quantity }
        });
      }
    }

    await order.save();

    // Émettre un événement Socket.IO pour le suivi en temps réel
    req.app.get('io').to(`order_${order._id}`).emit('orderStatusUpdate', {
      orderId: order._id,
      status,
      timestamp: new Date(),
      note
    });

    res.json({
      message: 'Statut mis à jour avec succès',
      order: {
        id: order._id,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
});

// Assigner un livreur à une commande
router.patch('/:id/assign-delivery', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'admin' && req.user.userType !== 'vendor') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const { deliveryPersonId } = req.body;

    // Vérifier la disponibilité du livreur
    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    if (!deliveryPerson || !deliveryPerson.availability.isAvailable) {
      return res.status(400).json({ message: 'Livreur non disponible' });
    }

    // Assigner le livreur
    order.deliveryPerson = deliveryPersonId;
    order.status = 'assigned';
    await order.save();

    // Mettre à jour le livreur
    await DeliveryPerson.findByIdAndUpdate(deliveryPersonId, {
      currentOrder: order._id,
      'availability.isAvailable': false
    });

    res.json({
      message: 'Livreur assigné avec succès',
      deliveryPerson: {
        id: deliveryPerson._id,
        name: `${deliveryPerson.firstName} ${deliveryPerson.lastName}`,
        phone: deliveryPerson.phone,
        vehicle: deliveryPerson.vehicle.type
      }
    });

  } catch (error) {
    console.error('Erreur assignation livreur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'assignation du livreur' });
  }
});

// Trouver des livreurs disponibles
router.get('/:id/available-delivery', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Chercher des livreurs disponibles dans un rayon de 10km
    const availableDelivery = await DeliveryPerson.find({
      'availability.isOnline': true,
      'availability.isAvailable': true,
      accountStatus: 'approved',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: order.deliveryAddress.coordinates.coordinates
          },
          $maxDistance: 10000 // 10km
        }
      }
    })
    .select('firstName lastName phone vehicle.type currentLocation stats.averageRating')
    .limit(10);

    res.json(availableDelivery);

  } catch (error) {
    console.error('Erreur recherche livreurs:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche de livreurs' });
  }
});

export default router;