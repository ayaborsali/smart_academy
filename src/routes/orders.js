import express from 'express';
import {
  createOrder,
  simulatePayment,
  getOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Routes des commandes
router.post('/', createOrder);
router.post('/simulate-payment', simulatePayment);
router.get('/:id', getOrder);
router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);

// Route pour demande de démo
router.post('/request-demo', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, message } = req.body;

    // Enregistrer la demande dans la base de données
    const DemoRequest = (await import('../models/DemoRequest.js')).default;
    const demoRequest = new DemoRequest({
      firstName,
      lastName,
      email,
      phone,
      company,
      message
    });

    await demoRequest.save();

    res.json({
      success: true,
      message: 'Demande de démo enregistrée avec succès',
      requestId: demoRequest._id
    });
  } catch (error) {
    console.error('Erreur demande démo:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'enregistrement de la demande'
    });
  }
});

// Route pour demande de brochure
router.post('/request-brochure', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company } = req.body;

    // Enregistrer la demande dans la base de données
    const BrochureRequest = (await import('../models/BrochureRequest.js')).default;
    const brochureRequest = new BrochureRequest({
      firstName,
      lastName,
      email,
      phone,
      company
    });

    await brochureRequest.save();

    res.json({
      success: true,
      message: 'Demande de brochure enregistrée avec succès',
      requestId: brochureRequest._id
    });
  } catch (error) {
    console.error('Erreur demande brochure:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'enregistrement de la demande'
    });
  }
});

export default router;