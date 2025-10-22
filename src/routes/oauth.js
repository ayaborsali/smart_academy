// backend/routes/oauth.js
import express from 'express' ;
const router = express.Router();
import axios  from 'axios';

// Callback Google OAuth
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Échanger le code contre un token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.FRONTEND_URL}/oauth-callback`,
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    // Récupérer les infos utilisateur
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = {
      email: userResponse.data.email,
      name: userResponse.data.name,
      picture: userResponse.data.picture
    };

    // Rediriger vers le frontend avec les données
    res.redirect(`${process.env.FRONTEND_URL}/inscription?email=${user.email}&name=${user.name}`);
    
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});