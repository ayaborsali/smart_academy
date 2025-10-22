import express from 'express';
const router = express.Router();
import axios from 'axios';

// Middleware de sécurité
router.use(express.json({ limit: '1mb' }));

// Google OAuth
router.get('/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(`${process.env.BACKEND_URL}/api/auth/google/callback`)}&` +
    `response_type=code&` +
    `scope=email%20profile&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    // Échange sécurisé du code
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    // Récupération sécurisée des infos utilisateur
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'RIOT-SYS-Academy/1.0'
      }
    });

    const userData = {
      email: userResponse.data.email,
      name: userResponse.data.name,
      provider: 'google'
    };

    // Redirection sécurisée vers le frontend
    const redirectUrl = `${process.env.FRONTEND_URL}/inscription?` +
      `email=${encodeURIComponent(userData.email)}&` +
      `name=${encodeURIComponent(userData.name || '')}`;

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

module.exports = router;