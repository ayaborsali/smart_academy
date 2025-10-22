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

// ✅ CORRECTION : Configuration email corrigée
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // ⚠️ Pour développement seulement
  }
});

// Vérifier la configuration email au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur configuration email:', error.message);
  } else {
    console.log('✅ Configuration email OK - Prêt à envoyer des emails');
  }
});

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iot_pack';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connecté à MongoDB local'))
.catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// Route de santé
app.get('/api/health', (req, res) => {
  console.log('✅ Health check reçu');
  res.status(200).json({ 
    status: 'OK', 
    message: 'RIOT-SYS Backend is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    database: 'MongoDB Local',
    email: process.env.SMTP_USER ? '✅ Configuré' : '❌ Non configuré'
  });
});

// Route de test email
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();
    
    // Test d'envoi d'email
    const testMailOptions = {
      from: process.env.SMTP_USER,
      to: 'borsaliaya1@gmail.com',
      subject: 'Test Email - Smart Academy',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Test d'envoi d'email réussi !</h2>
          <p>Ceci est un email de test envoyé depuis votre serveur Smart Academy.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Serveur:</strong> ${process.env.BACKEND_URL || 'http://localhost:5000'}</p>
        </div>
      `
    };

    await transporter.sendMail(testMailOptions);
    
    res.json({
      success: true,
      message: 'Email de test envoyé avec succès à borsaliaya1@gmail.com'
    });
  } catch (error) {
    console.error('Erreur test email:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur configuration email: ' + error.message
    });
  }
});

// Route Google OAuth
app.get('/api/auth/google', (req, res) => {
  try {
    const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`;
    
    console.log('\n🔐 DÉBUT FLUX OAuth Google');
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        error: 'Configuration OAuth manquante',
        message: 'GOOGLE_CLIENT_ID non configuré'
      });
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=email%20profile&` +
      `access_type=offline&` +
      `prompt=consent`;

    console.log('🔗 Redirection vers Google OAuth...');
    res.redirect(authUrl);

  } catch (error) {
    console.error('❌ Erreur OAuth:', error);
    res.status(500).json({ error: 'Erreur serveur OAuth' });
  }
});

// Callback Google OAuth
app.get('/api/auth/google/callback', (req, res) => {
  console.log('\n📨 CALLBACK OAuth Google reçu');
  
  const { code, error } = req.query;

  if (error) {
    console.error('❌ Erreur OAuth:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }

  if (!code) {
    console.error('❌ Aucun code reçu');
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_code`);
  }

  console.log('✅ Code OAuth reçu');

  // Simulation réussie
  const userData = {
    email: 'utilisateur.google@gmail.com',
    name: 'Utilisateur Google',
    provider: 'google'
  };

  const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/inscription?` +
    `email=${encodeURIComponent(userData.email)}&` +
    `name=${encodeURIComponent(userData.name)}&` +
    `provider=${userData.provider}&` +
    `success=true`;

  console.log('🔄 Redirection vers frontend');
  res.redirect(redirectUrl);
});

// ✅ ROUTE CONTACT AVEC ENVOI RÉEL D'EMAILS
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;
    
    // Validation
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

    // 1. Email pour l'entreprise (borsaliaya1@gmail.com)
    const companyMailOptions = {
      from: process.env.SMTP_USER,
      to: 'borsaliaya1@gmail.com',
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">📧 Nouveau message de contact</h2>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">👤 Informations du contact</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Entreprise :</strong> ${company || 'Non spécifiée'}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>

          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">💬 Message</h3>
            <p style="white-space: pre-line; line-height: 1.6; background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              📱 Ce message a été envoyé depuis le formulaire de contact de Smart Academy.
            </p>
          </div>
        </div>
      `
    };

    // 2. Email de confirmation pour le visiteur
    const confirmationMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Confirmation de réception de votre message - Smart Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb;">✅ Merci pour votre message !</h2>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <p>Notre équipe va l'étudier et vous répondre dans les plus brefs délais.</p>
          </div>

          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #1e293b; margin-top: 0;">📋 Récapitulatif de votre message</h4>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Message :</strong></p>
            <div style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #2563eb;">
              <p style="white-space: pre-line; margin: 0;">${message}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              <strong>🏫 Smart Academy</strong><br>
              📧 Email: borsaliaya1@gmail.com<br>
              📞 Tél: +216 XX XXX XXX<br>
              📍 Tunis, Tunisie
            </p>
          </div>
        </div>
      `
    };

    // Envoyer les deux emails
    await transporter.sendMail(companyMailOptions);
    console.log('✅ Email envoyé à l\'entreprise: borsaliaya1@gmail.com');
    
    await transporter.sendMail(confirmationMailOptions);
    console.log('✅ Email de confirmation envoyé au visiteur:', email);

    res.json({
      success: true,
      message: 'Message envoyé avec succès. Vous recevrez une confirmation par email.'
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    
    // Erreurs spécifiques
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        error: 'Erreur d\'authentification email. Vérifiez SMTP_USER et SMTP_PASS dans .env'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du message: ' + error.message
    });
  }
});

// Routes orders temporaires
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, shippingAddress } = req.body;
    
    console.log('🛒 Nouvelle commande:');
    console.log('   Client:', customer?.firstName, customer?.lastName);
    
    const orderNumber = `IOT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-0001`;
    
    res.json({
      success: true,
      message: 'Commande créée avec succès',
      order: {
        orderNumber,
        total: 2999,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Erreur commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    res.json({
      success: true,
      orders: [],
      message: 'Aucune commande'
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes API simples
app.get('/api/formations', (req, res) => {
  res.json([
    {
      id: 1,
      title: { fr: 'IA', en: 'AI', ar: 'ذكاء' },
      description: { fr: 'Formation IA', en: 'AI Training', ar: 'تدريب' },
      category: 'ai',
      duration: '120h',
      level: 'intermédiaire',
      price: { amount: 2999, currency: 'EUR' }
    }
  ]);
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
      'GET /api/test-email',
      'GET /api/auth/google', 
      'GET /api/auth/google/callback',
      'POST /api/contact',
      'GET /api/formations',
      'POST /api/orders',
      'GET /api/orders'
    ]
  });
});

// Gestion d'erreurs globale
app.use((error, req, res, next) => {
  console.error('💥 Erreur globale:', error.message);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: 'Veuillez réessayer plus tard'
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log('🚀 SERVEUR SMART ACADEMY DÉMARRÉ - EMAILS CORRIGÉS');
  console.log('='.repeat(70));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 Backend: http://localhost:${PORT}`);
  console.log(`🗄️  Base de données: ${MONGODB_URI}`);
  console.log(`📧 Email: ${process.env.SMTP_USER ? '✅ ' + process.env.SMTP_USER : '❌ NON CONFIGURÉ'}`);
  console.log('='.repeat(70));
  console.log('🧪 TESTS DISPONIBLES:');
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/test-email`);
  console.log('='.repeat(70));
  console.log('📝 ROUTES ACTIVES:');
  console.log('   POST /api/contact     - Envoyer un message (emails réels)');
  console.log('   GET  /api/test-email  - Tester la configuration email');
  console.log('='.repeat(70));
  console.log('⚠️  SSL désactivé pour développement - À corriger en production');
  console.log('='.repeat(70));
});