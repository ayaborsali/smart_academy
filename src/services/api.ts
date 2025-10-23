// Configuration basée sur l'environnement
const getApiBaseUrl = () => {
  // Si nous sommes en développement, utilisez l'URL de développement
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  // En production, utilisez l'URL de votre API déployée
  return 'https://votre-api-domain.com/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  // Récupérer les formations disponibles
  async getFormations() {
    try {
      console.log('Fetching formations from:', `${API_BASE_URL}/formations`);
      const response = await fetch(`${API_BASE_URL}/formations`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des formations');
      const data = await response.json();
      console.log('Formations data:', data);
      return data;
    } catch (error) {
      console.error('Erreur API getFormations:', error);
      // Retourner des données mockées en cas d'erreur
      return this.getMockFormations();
    }
  }

  // Récupérer les packs disponibles
  async getPacks() {
    try {
      console.log('Fetching packs from:', `${API_BASE_URL}/packs`);
      const response = await fetch(`${API_BASE_URL}/packs`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des packs');
      const data = await response.json();
      console.log('Packs data:', data);
      return data;
    } catch (error) {
      console.error('Erreur API getPacks:', error);
      // Retourner des données mockées en cas d'erreur
      return this.getMockPacks();
    }
  }

  // Soumettre une inscription
  async submitInscription(inscriptionData) {
    try {
      console.log('Submitting inscription:', inscriptionData);
      
      // Simulation d'appel API réussi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, décommentez ceci :
      /*
      const response = await fetch(`${API_BASE_URL}/inscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inscriptionData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'inscription');
      return await response.json();
      */
      
      // Simulation de réponse réussie
      return {
        success: true,
        reference: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: 'Inscription enregistrée avec succès'
      };
    } catch (error) {
      console.error('Erreur API submitInscription:', error);
      throw error;
    }
  }

  // Vérifier la disponibilité d'une formation
  async checkFormationAvailability(formationId) {
    try {
      console.log('Checking availability for formation:', formationId);
      
      // Simulation de vérification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En production, décommentez ceci :
      /*
      const response = await fetch(`${API_BASE_URL}/formations/${formationId}/availability`);
      if (!response.ok) throw new Error('Erreur lors de la vérification de disponibilité');
      return await response.json();
      */
      
      // Simulation de disponibilité
      return { available: true, formation: { id: formationId } };
    } catch (error) {
      console.error('Erreur API checkFormationAvailability:', error);
      throw error;
    }
  }

  // Envoyer un email de confirmation
  async sendConfirmationEmail(email, inscriptionDetails) {
    try {
      console.log('Sending confirmation email to:', email, inscriptionDetails);
      
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En production, décommentez ceci :
      /*
      const response = await fetch(`${API_BASE_URL}/email/confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, ...inscriptionDetails }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi de l\'email');
      return await response.json();
      */
      
      // Simulation d'envoi réussi
      return { success: true, message: 'Email de confirmation envoyé' };
    } catch (error) {
      console.error('Erreur API sendConfirmationEmail:', error);
      // Ne pas throw l'erreur pour ne pas bloquer le processus d'inscription
      return { success: false, message: 'Email non envoyé mais inscription enregistrée' };
    }
  }

  // Données mockées pour les formations
  getMockFormations() {
    return [
      {
        id: 'ai',
        title: 'Intelligence Artificielle',
        duration: '120h',
        level: 'Intermédiaire',
        price: 2999,
        description: 'Maîtrisez les algorithmes de machine learning, deep learning et les applications pratiques de l\'IA.'
      },
      {
        id: 'iot',
        title: 'Internet des Objets (IoT)',
        duration: '100h',
        level: 'Débutant',
        price: 2499,
        description: 'Développez des solutions IoT complètes, de la conception des capteurs à l\'analyse des données.'
      },
      {
        id: 'automates',
        title: 'Automates Programmables',
        duration: '80h',
        level: 'Intermédiaire',
        price: 1999,
        description: 'Programmez et configurez des automates industriels connectés pour l\'automatisation avancée.'
      }
    ];
  }

  // Données mockées pour les packs
  getMockPacks() {
    return [
      {
        id: 'basic',
        name: 'Pack Basique',
        price: 0,
        originalPrice: 499,
        description: 'Parfait pour débuter',
        features: [
          'Accès aux cours en ligne',
          'Support technique de base',
          'Exercices pratiques',
          'Certificat de participation'
        ],
        popular: false
      },
      {
        id: 'standard',
        name: 'Pack Standard',
        price: 299,
        originalPrice: 799,
        description: 'Le plus populaire',
        features: [
          'Tout du Pack Basique',
          'Support prioritaire',
          'Projets pratiques guidés',
          'Sessions de mentorat (4h)',
          'Accès à la communauté',
          'Certificat accrédité'
        ],
        popular: true
      },
      {
        id: 'premium',
        name: 'Pack Premium',
        price: 599,
        originalPrice: 1299,
        description: 'Solution complète',
        features: [
          'Tout du Pack Standard',
          'Support illimité 24/7',
          'Projets personnalisés',
          'Mentorat individuel (12h)',
          'Accès vie-time aux mises à jour',
          'Préparation aux certifications',
          'Accès aux recruteurs partenaires',
          'Certificat premium'
        ],
        popular: false
      }
    ];
  }
}

export default new ApiService();