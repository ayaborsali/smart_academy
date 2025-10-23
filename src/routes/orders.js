import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Route pour créer une commande
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod, billingAddress } = req.body;
    
    const order = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod,
      billingAddress
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order
    });
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la commande: ' + error.message
    });
  }
});

// Route pour récupérer toutes les commandes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des commandes'
    });
  }
});

// Route pour récupérer une commande spécifique
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la commande'
    });
  }
});

// Route pour mettre à jour le statut d'une commande
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut de la commande mis à jour',
      order
    });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    });
  }
});

// Route pour simulation de paiement
router.post('/simulate-payment', async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    order.status = 'paid';
    order.paymentMethod = paymentMethod;
    await order.save();

    res.json({
      success: true,
      message: 'Paiement simulé avec succès',
      order
    });
  } catch (error) {
    console.error('Erreur simulation paiement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la simulation du paiement'
    });
  }
});

export default router;