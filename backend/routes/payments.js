import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Initier un paiement
router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentMethod, phoneNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (order.payment.status === 'paid') {
      return res.status(400).json({ message: 'Commande déjà payée' });
    }

    // Générer un ID de transaction unique
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mettre à jour les informations de paiement
    order.payment = {
      method: paymentMethod,
      phoneNumber,
      amount: order.pricing.total,
      transactionId,
      status: 'pending',
      initiatedAt: new Date()
    };

    await order.save();

    // Simuler l'initiation du paiement selon le provider
    let paymentResponse;
    switch (paymentMethod) {
      case 'orange_money':
        paymentResponse = await initiateOrangeMoneyPayment(phoneNumber, order.pricing.total, transactionId);
        break;
      case 'mtn_money':
        paymentResponse = await initiateMTNMoneyPayment(phoneNumber, order.pricing.total, transactionId);
        break;
      case 'moov_money':
        paymentResponse = await initiateMoovMoneyPayment(phoneNumber, order.pricing.total, transactionId);
        break;
      default:
        return res.status(400).json({ message: 'Méthode de paiement non supportée' });
    }

    if (paymentResponse.success) {
      res.json({
        message: 'Paiement initié avec succès',
        transactionId,
        instructions: paymentResponse.instructions,
        amount: order.pricing.total,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });
    } else {
      order.payment.status = 'failed';
      order.payment.errorMessage = paymentResponse.error;
      await order.save();

      res.status(400).json({
        message: 'Échec de l\'initiation du paiement',
        error: paymentResponse.error
      });
    }

  } catch (error) {
    console.error('Erreur initiation paiement:', error);
    res.status(500).json({ message: 'Erreur lors de l\'initiation du paiement' });
  }
});

// Vérifier le statut d'un paiement
router.get('/status/:transactionId', authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const order = await Order.findOne({ 'payment.transactionId': transactionId });
    if (!order) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    // Vérifier le statut selon le provider
    let statusResponse;
    switch (order.payment.method) {
      case 'orange_money':
        statusResponse = await checkOrangeMoneyStatus(transactionId);
        break;
      case 'mtn_money':
        statusResponse = await checkMTNMoneyStatus(transactionId);
        break;
      case 'moov_money':
        statusResponse = await checkMoovMoneyStatus(transactionId);
        break;
      default:
        return res.status(400).json({ message: 'Méthode de paiement non supportée' });
    }

    // Mettre à jour le statut si nécessaire
    if (statusResponse.status !== order.payment.status) {
      order.payment.status = statusResponse.status;
      
      if (statusResponse.status === 'paid') {
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        
        // Notifier via Socket.IO
        req.app.get('io').to(`order_${order._id}`).emit('paymentConfirmed', {
          orderId: order._id,
          transactionId,
          amount: order.pricing.total
        });
      } else if (statusResponse.status === 'failed') {
        order.payment.errorMessage = statusResponse.error;
      }

      await order.save();
    }

    res.json({
      transactionId,
      status: order.payment.status,
      amount: order.payment.amount,
      method: order.payment.method,
      initiatedAt: order.payment.initiatedAt,
      paidAt: order.payment.paidAt,
      error: order.payment.errorMessage
    });

  } catch (error) {
    console.error('Erreur vérification statut:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification du statut' });
  }
});

// Webhook pour les notifications de paiement
router.post('/webhook/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const webhookData = req.body;

    console.log(`Webhook reçu de ${provider}:`, webhookData);

    let transactionId, status, error;

    // Traiter selon le provider
    switch (provider) {
      case 'orange':
        transactionId = webhookData.transaction_id;
        status = webhookData.status === 'SUCCESS' ? 'paid' : 'failed';
        error = webhookData.error_message;
        break;
      case 'mtn':
        transactionId = webhookData.externalId;
        status = webhookData.status === 'SUCCESSFUL' ? 'paid' : 'failed';
        error = webhookData.reason;
        break;
      case 'moov':
        transactionId = webhookData.transactionId;
        status = webhookData.status === 'COMPLETED' ? 'paid' : 'failed';
        error = webhookData.errorMessage;
        break;
      default:
        return res.status(400).json({ message: 'Provider non supporté' });
    }

    // Trouver et mettre à jour la commande
    const order = await Order.findOne({ 'payment.transactionId': transactionId });
    if (!order) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    const previousStatus = order.payment.status;
    order.payment.status = status;

    if (status === 'paid') {
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      
      // Notifier le client
      req.app.get('io').to(`order_${order._id}`).emit('paymentConfirmed', {
        orderId: order._id,
        transactionId,
        amount: order.pricing.total
      });

    } else if (status === 'failed') {
      order.payment.errorMessage = error;
    }

    await order.save();

    // Log du changement de statut
    console.log(`Paiement ${transactionId}: ${previousStatus} -> ${status}`);

    res.json({ message: 'Webhook traité avec succès' });

  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    res.status(500).json({ message: 'Erreur lors du traitement du webhook' });
  }
});

// Rembourser un paiement
router.post('/refund', authMiddleware, async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.payment.status !== 'paid') {
      return res.status(400).json({ message: 'Commande non payée, remboursement impossible' });
    }

    // Initier le remboursement selon le provider
    let refundResponse;
    const refundId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (order.payment.method) {
      case 'orange_money':
        refundResponse = await initiateOrangeMoneyRefund(
          order.payment.transactionId,
          order.payment.amount,
          refundId
        );
        break;
      case 'mtn_money':
        refundResponse = await initiateMTNMoneyRefund(
          order.payment.transactionId,
          order.payment.amount,
          refundId
        );
        break;
      case 'moov_money':
        refundResponse = await initiateMoovMoneyRefund(
          order.payment.transactionId,
          order.payment.amount,
          refundId
        );
        break;
      default:
        return res.status(400).json({ message: 'Remboursement non supporté pour cette méthode' });
    }

    if (refundResponse.success) {
      order.payment.refund = {
        refundId,
        amount: order.payment.amount,
        reason,
        status: 'processing',
        initiatedAt: new Date()
      };

      order.status = 'refunded';
      await order.save();

      res.json({
        message: 'Remboursement initié avec succès',
        refundId,
        amount: order.payment.amount
      });

    } else {
      res.status(400).json({
        message: 'Échec du remboursement',
        error: refundResponse.error
      });
    }

  } catch (error) {
    console.error('Erreur remboursement:', error);
    res.status(500).json({ message: 'Erreur lors du remboursement' });
  }
});

// Obtenir l'historique des paiements
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = { customer: req.user.userId };
    if (status) {
      filter['payment.status'] = status;
    }

    const payments = await Order.find(filter)
      .select('_id createdAt payment pricing status')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      payments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: payments.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Erreur historique paiements:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
});

// Fonctions simulées pour les providers de paiement mobile

async function initiateOrangeMoneyPayment(phoneNumber, amount, transactionId) {
  // Simulation - à remplacer par l'API réelle d'Orange Money
  console.log(`Initiation Orange Money: ${phoneNumber}, ${amount} FCFA, ${transactionId}`);
  
  return {
    success: true,
    instructions: `Composez #144*1*1# et suivez les instructions pour valider le paiement de ${amount} FCFA.`
  };
}

async function initiateMTNMoneyPayment(phoneNumber, amount, transactionId) {
  // Simulation - à remplacer par l'API réelle de MTN Money
  console.log(`Initiation MTN Money: ${phoneNumber}, ${amount} FCFA, ${transactionId}`);
  
  return {
    success: true,
    instructions: `Composez *133# et suivez les instructions pour valider le paiement de ${amount} FCFA.`
  };
}

async function initiateMoovMoneyPayment(phoneNumber, amount, transactionId) {
  // Simulation - à remplacer par l'API réelle de Moov Money
  console.log(`Initiation Moov Money: ${phoneNumber}, ${amount} FCFA, ${transactionId}`);
  
  return {
    success: true,
    instructions: `Composez *555# et suivez les instructions pour valider le paiement de ${amount} FCFA.`
  };
}

async function checkOrangeMoneyStatus(transactionId) {
  // Simulation - à remplacer par l'API réelle
  return { status: Math.random() > 0.5 ? 'paid' : 'pending' };
}

async function checkMTNMoneyStatus(transactionId) {
  // Simulation - à remplacer par l'API réelle
  return { status: Math.random() > 0.5 ? 'paid' : 'pending' };
}

async function checkMoovMoneyStatus(transactionId) {
  // Simulation - à remplacer par l'API réelle
  return { status: Math.random() > 0.5 ? 'paid' : 'pending' };
}

async function initiateOrangeMoneyRefund(transactionId, amount, refundId) {
  // Simulation - à remplacer par l'API réelle
  return { success: true };
}

async function initiateMTNMoneyRefund(transactionId, amount, refundId) {
  // Simulation - à remplacer par l'API réelle
  return { success: true };
}

async function initiateMoovMoneyRefund(transactionId, amount, refundId) {
  // Simulation - à remplacer par l'API réelle
  return { success: true };
}

export default router;