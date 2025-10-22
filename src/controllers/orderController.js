import Order from '../models/Order.js';

// Créer une nouvelle commande
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      orderDetails = {
        product: 'Pack IoT Complet',
        price: 2999,
        quantity: 1,
        discount: 0
      },
      paymentMethod = 'bank_transfer'
    } = req.body;

    // Validation des données requises
    if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
      return res.status(400).json({
        success: false,
        error: 'Informations client incomplètes'
      });
    }

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.postalCode) {
      return res.status(400).json({
        success: false,
        error: 'Adresse de livraison incomplète'
      });
    }

    const order = new Order({
      customer,
      shippingAddress,
      orderDetails,
      payment: {
        method: paymentMethod
      }
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        total: order.orderDetails.total,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Erreur création commande:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création de la commande'
    });
  }
};

// Simuler un paiement (pour développement)
export const simulatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    // Simuler un paiement réussi
    order.payment.status = 'paid';
    order.status = 'confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'Paiement simulé avec succès',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.payment.status
      }
    });
  } catch (error) {
    console.error('Erreur simulation paiement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la simulation du paiement'
    });
  }
};

// Récupérer une commande
export const getOrder = async (req, res) => {
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
};

// Lister toutes les commandes
export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des commandes'
    });
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    });
  }
};