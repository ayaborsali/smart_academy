import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Middleware de base
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/riot_sys';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connecté à MongoDB local'))
.catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'RIOT-SYS Backend is running',
    timestamp: new Date().toISOString()
  });
});

// ========== ROUTES TEMPORAIRES POUR IOT ==========

// Route temporaire pour commandes IoT
app.post('/api/iot/orders', async (req, res) => {
  try {
    const { fullName, email, phone, company, address } = req.body;
    
    console.log('📦 Nouvelle commande IoT reçue:');
    console.log('   Client:', fullName);
    console.log('   Email:', email);
    
    // Simulation de création de commande
    const orderNumber = `IOT-${Date.now()}`;
    
    res.json({
      success: true,
      message: 'Commande IoT créée avec succès',
      data: {
        orderId: 'temp-' + Date.now(),
        orderNumber: orderNumber,
        customer: { fullName, email, phone, company, address },
        totalAmount: 150,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur commande IoT:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur temporaire'
    });
  }
});

// Route temporaire pour demandes de démo IoT
app.post('/api/iot/demo-requests', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, message } = req.body;
    
    console.log('📞 Nouvelle demande de démo IoT:');
    console.log('   Client:', firstName, lastName);
    console.log('   Email:', email);
    
    res.json({
      success: true,
      message: 'Demande de démo enregistrée avec succès',
      data: {
        requestId: 'demo-' + Date.now(),
        requestNumber: `DEMO-${Date.now()}`,
        status: 'new'
      }
    });
  } catch (error) {
    console.error('Erreur demande démo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur temporaire'
    });
  }
});

// Route temporaire pour demandes de brochure IoT
app.post('/api/iot/brochure-requests', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company } = req.body;
    
    console.log('📄 Nouvelle demande de brochure IoT:');
    console.log('   Client:', firstName, lastName);
    console.log('   Email:', email);
    
    res.json({
      success: true,
      message: 'Demande de brochure enregistrée avec succès',
      data: {
        requestId: 'bro-' + Date.now(),
        requestNumber: `BRO-${Date.now()}`,
        status: 'new'
      }
    });
  } catch (error) {
    console.error('Erreur demande brochure:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur temporaire'
    });
  }
});

// ========== ROUTES CONTACT EXISTANTES ==========

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    console.log('📧 Nouveau message de contact:');
    console.log('   Nom:', name);
    console.log('   Email:', email);
    console.log('   Sujet:', subject);

    res.json({
      success: true,
      message: 'Message envoyé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du message: ' + error.message
    });
  }
});

// Gestion 404
app.use((req, res) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /api/health',
      'POST /api/contact',
      'POST /api/iot/orders',
      'POST /api/iot/demo-requests', 
      'POST /api/iot/brochure-requests'
    ]
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log('🚀 SERVEUR RIOT-SYS DÉMARRÉ - MODE TEMPORAIRE');
  console.log('='.repeat(70));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 Backend: http://localhost:${PORT}`);
  console.log(`🗄️  Base de données: ${MONGODB_URI}`);
  console.log('='.repeat(70));
  console.log('📝 ROUTES ACTIVES:');
  console.log('   POST /api/contact              - Envoyer un message');
  console.log('   POST /api/iot/orders           - Commander pack IoT');
  console.log('   POST /api/iot/demo-requests    - Demander une démo');
  console.log('   POST /api/iot/brochure-requests- Demander brochure');
  console.log('='.repeat(70));
});