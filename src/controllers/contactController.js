import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'borsaliaya1@gmail.com',
    pass: process.env.SMTP_PASS, // Mot de passe d'application Gmail
  },
});

// Envoyer un email de contact
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    // Validation des données requises
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Email pour l'entreprise
    const companyMailOptions = {
      from: process.env.SMTP_USER || 'borsaliaya1@gmail.com',
      to: 'borsaliaya1@gmail.com',
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Nouveau message de contact</h2>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Informations du contact :</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Entreprise :</strong> ${company || 'Non spécifiée'}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
          </div>

          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Message :</h3>
            <p style="white-space: pre-line; line-height: 1.6;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              Ce message a été envoyé depuis le formulaire de contact de Smart Academy.
            </p>
          </div>
        </div>
      `
    };

    // Email de confirmation pour le visiteur
    const confirmationMailOptions = {
      from: process.env.SMTP_USER || 'borsaliaya1@gmail.com',
      to: email,
      subject: 'Confirmation de réception de votre message - Smart Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">Merci pour votre message !</h2>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <p>Notre équipe va l'étudier et vous répondre dans les plus brefs délais.</p>
          </div>

          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #1e293b; margin-top: 0;">Récapitulatif de votre message :</h4>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Message :</strong></p>
            <div style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #2563eb;">
              <p style="white-space: pre-line; margin: 0;">${message}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              <strong>Smart Academy</strong><br>
              Email: contact@smart-academy.tn<br>
              Tél: +216 XX XXX XXX<br>
              Tunis, Tunisie
            </p>
          </div>
        </div>
      `
    };

    // Envoyer les deux emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(confirmationMailOptions);

    console.log(`Email de contact envoyé de ${name} (${email})`);

    res.json({
      success: true,
      message: 'Message envoyé avec succès. Vous recevrez une confirmation par email.'
    });

  } catch (error) {
    console.error('Erreur envoi email contact:', error);
    
    // Erreurs spécifiques Gmail
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        error: 'Erreur d\'authentification email. Veuillez vérifier la configuration SMTP.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    });
  }
};

// Tester la configuration email
exports.testEmailConfig = async (req, res) => {
  try {
    await transporter.verify();
    res.json({
      success: true,
      message: 'Configuration email OK'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur configuration email: ' + error.message
    });
  }
};