import express from 'express';
import { sendContactEmail, testEmailConfig } from '../controllers/contactController.js';

const router = express.Router();

// Route pour envoyer un message de contact
router.post('/', sendContactEmail);

// Route pour tester la configuration email
router.get('/test', testEmailConfig);

export default router;