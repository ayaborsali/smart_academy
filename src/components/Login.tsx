import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ArrowLeft, User } from 'lucide-react';

const Login = ({ 
  onNavigateToInscription = () => console.warn('Navigation function not provided'), 
  onNavigateToHome = () => console.warn('Navigation function not provided') 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Vérifier si l'utilisateur est déjà connecté (au cas où il revient d'OAuth)
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        console.log('Utilisateur déjà connecté, redirection vers inscription');
        onNavigateToInscription();
      }
    };

    checkAuth();

    // Vérifier toutes les 2 secondes au cas où (pour OAuth)
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, [onNavigateToInscription]);

  // ✅ Fonctions OAuth améliorées
  const handleGoogleOAuth = () => {
    // Stocker l'état avant la redirection
    localStorage.setItem('oauthRedirect', 'inProgress');
    console.log('Début OAuth Google');
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleMicrosoftOAuth = () => {
    // Stocker l'état avant la redirection
    localStorage.setItem('oauthRedirect', 'inProgress');
    console.log('Début OAuth Microsoft');
    window.location.href = 'http://localhost:5000/api/auth/microsoft';
  };

  // ✅ Fonction de connexion email
  const handleEmailLogin = async () => {
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ Stocker les informations de connexion
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginMethod', 'email');
      
      console.log('Connexion email réussie, redirection vers inscription');
      
      if (typeof onNavigateToInscription === 'function') {
        onNavigateToInscription();
      } else {
        console.error('onNavigateToInscription is not a function');
        alert('Connexion réussie ! Redirection...');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Gestion sécurisée de la navigation
  const handleBackToHome = () => {
    if (typeof onNavigateToHome === 'function') {
      onNavigateToHome();
    } else {
      console.error('onNavigateToHome is not a function');
      window.history.back();
    }
  };

  // ✅ Gestion de la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailLogin();
    }
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-md px-4 mx-auto sm:px-6 lg:px-8">
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          {/* Bouton retour */}
          <button
            onClick={handleBackToHome}
            className="flex items-center mb-6 space-x-2 text-blue-600 transition-colors duration-200 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          {/* En-tête */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Connectez-vous
            </h1>
            <p className="text-gray-600">
              Choisissez votre méthode de connexion
            </p>
          </div>

          {/* Boutons OAuth */}
          <div className="mb-6 space-y-4">
            <button
              onClick={handleGoogleOAuth}
              className="flex items-center justify-center w-full py-3 space-x-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Continuer avec Google</span>
            </button>

            <button
              onClick={handleMicrosoftOAuth}
              className="flex items-center justify-center w-full py-3 space-x-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span className="font-medium">Continuer avec Microsoft</span>
            </button>
          </div>

          {/* Séparateur */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

         {/* Email manuel */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Entrez votre email
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="votre@email.com"
                  className={`w-full py-3 pl-10 pr-4 transition-colors duration-200 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              onClick={handleEmailLogin}
              disabled={isLoading || !email}
              className="flex items-center justify-center w-full py-3 space-x-2 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Continuer avec email</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          
          {/* Information de sécurité */}
          <div className="p-4 mt-6 rounded-lg bg-blue-50">
            <p className="text-sm text-center text-blue-700">
              🔐 Connexion sécurisée - Nous ne partageons jamais vos données
            </p>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Login;