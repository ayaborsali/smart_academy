import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les paramètres de l'URL (si votre backend les envoie)
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (email) {
      // Stocker les informations de l'utilisateur
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginMethod', 'oauth');
      
      console.log('OAuth réussi, redirection vers inscription');
      navigate('/inscription');
    } else {
      // Fallback: vérifier le localStorage
      setTimeout(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
          navigate('/inscription');
        } else {
          navigate('/login');
        }
      }, 2000);
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-900">Connexion en cours...</h2>
        <p className="mt-2 text-gray-600">Redirection vers votre compte</p>
      </div>
    </div>
  );
};

export default OAuthRedirect;