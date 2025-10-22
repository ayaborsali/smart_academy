import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Templates d'emails
const templates = {
  'contact-confirmation': (context) => ({
    subject: 'Confirmation de votre message - RIOT-SYS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Merci pour votre message, ${context.name} !</h2>
        <p>Nous avons bien reçu votre demande concernant : <strong>${context.subject}</strong></p>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          RIOT-SYS - Formation & Innovation<br>
          Email: contact@smart-academy.tn<br>
          Tél: +216 XX XXX XXX
        </p>
      </div>
    `
  }),
  'contact-notification': (context) => ({
    subject: `Nouveau contact: ${context.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${context.name}</p>
        <p><strong>Email:</strong> ${context.email}</p>
        <p><strong>Entreprise:</strong> ${context.company || 'Non spécifié'}</p>
        <p><strong>Sujet:</strong> ${context.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 5px;">
          ${context.message}
        </div>
      </div>
    `
  })
};

exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
    const emailTemplate = templates[template](context);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: subject || emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};