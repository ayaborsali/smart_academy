import express from 'express';
import {
  createIoTOrder,
  getIoTOrders,
  updateIoTOrderStatus,
  createDemoRequest,
  createBrochureRequest,
  getIoTStats
} from '../controllers/iotController.js';

const router = express.Router();

// Routes pour les commandes IoT
router.post('/orders', createIoTOrder);
router.get('/orders', getIoTOrders);
router.patch('/orders/:id/status', updateIoTOrderStatus);

// Routes pour les demandes
router.post('/brochure-requests', createBrochureRequest);

// Statistiques
router.get('/stats', getIoTStats);

export default router;