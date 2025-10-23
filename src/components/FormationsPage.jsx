import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Brain, 
  Cpu, 
  Settings, 
  Clock, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle,
  BookOpen,
  Zap,
  Shield
} from 'lucide-react';

const FormationsPage = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Domaines de formation
  const domains = [
    { id: 'all', name: { fr: 'Toutes', en: 'All', ar: 'الكل' }, icon: BookOpen },
    { id: 'ai', name: { fr: 'Intelligence Artificielle', en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' }, icon: Brain },
    { id: 'iot', name: { fr: 'Internet des Objets', en: 'Internet of Things', ar: 'إنترنت الأشياء' }, icon: Cpu },
    { id: 'automation', name: { fr: 'Automatisation', en: 'Automation', ar: 'الأتمتة' }, icon: Settings }
  ];

  // Charger les formations depuis l'API
  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      setIsLoading(true);
      // Utilisation d'un timeout pour simuler le chargement
      setTimeout(() => {
        setFormations(getMockFormations());
        setIsLoading(false);
      }, 1000);
      
      // Décommentez cette partie quand votre API sera prête
      /*
      const response = await fetch('http://localhost:5000/api/formations');
      const data = await response.json();
      
      if (data.success) {
        setFormations(data.data);
      } else {
        setFormations(getMockFormations());
      }
      */
    } catch (error) {
      console.error('Erreur chargement formations:', error);
      setFormations(getMockFormations());
      setIsLoading(false);
    }
  };

  // Données mockées de secours
  const getMockFormations = () => [
    {
      id: 'ai-basics',
      title: 'Introduction à l\'IA',
      description: 'Découvrez les fondamentaux de l\'intelligence artificielle et ses applications pratiques.',
      duration: '40h',
      level: 'Débutant',
      price: 1499,
      domain: 'ai',
      image: '/images/ai-basics.jpg',
      features: ['Machine Learning', 'Deep Learning', 'Applications pratiques'],
      popular: true,
      instructor: 'Dr. Sarah Chen'
    },
    {
      id: 'ai-advanced',
      title: 'IA Avancée et Machine Learning',
      description: 'Approfondissez vos connaissances en ML, deep learning et réseaux de neurones.',
      duration: '80h',
      level: 'Intermédiaire',
      price: 2499,
      domain: 'ai',
      image: '/images/ai-advanced.jpg',
      features: ['Réseaux de neurones', 'Computer Vision', 'NLP'],
      popular: false,
      instructor: 'Prof. Ahmed Kacem'
    },
    {
      id: 'iot-fundamentals',
      title: 'Fondamentaux IoT',
      description: 'Apprenez les bases de l\'Internet des Objets et développez vos premiers projets connectés.',
      duration: '60h',
      level: 'Débutant',
      price: 1799,
      domain: 'iot',
      image: '/images/iot-basics.jpg',
      features: ['Capteurs', 'Réseaux IoT', 'Protocoles'],
      popular: true,
      instructor: 'Ing. Marco Silva'
    },
    {
      id: 'iot-advanced',
      title: 'IoT Industriel Avancé',
      description: 'Maîtrisez l\'IoT industriel avec les protocoles avancés et la sécurité des données.',
      duration: '100h',
      level: 'Intermédiaire',
      price: 2999,
      domain: 'iot',
      image: '/images/iot-advanced.jpg',
      features: ['IIoT', 'Sécurité', 'Cloud Computing'],
      popular: false,
      instructor: 'Dr. Elena Petrova'
    },
    {
      id: 'plc-basics',
      title: 'Programmation Automates (PLC)',
      description: 'Initiation à la programmation des automates programmables industriels.',
      duration: '50h',
      level: 'Débutant',
      price: 1599,
      domain: 'automation',
      image: '/images/plc-basics.jpg',
      features: ['Ladder', 'ST', 'SCADA'],
      popular: true,
      instructor: 'Ing. Jean Dupont'
    },
    {
      id: 'automation-advanced',
      title: 'Automatisation Industrielle Avancée',
      description: 'Automatisation complète des processus industriels avec intégration IoT.',
      duration: '120h',
      level: 'Avancé',
      price: 3499,
      domain: 'automation',
      image: '/images/automation-advanced.jpg',
      features: ['Robotics', 'IIoT', 'Digital Twin'],
      popular: false,
      instructor: 'Dr. Robert Schmidt'
    }
  ];

  // Filtrer les formations par domaine
  const filteredFormations = selectedDomain === 'all' 
    ? formations 
    : formations.filter(formation => formation.domain === selectedDomain);

  // Navigation vers l'inscription
  const handleInscription = (formation) => {
    localStorage.setItem('selectedFormation', JSON.stringify(formation));
    localStorage.setItem('selectedFormationId', formation.id);
    navigate('/inscription');
  };

  // Navigation vers la page d'accueil
  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <section className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <p className="text-gray-600">Chargement des formations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mb-12 text-center">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center mb-6 text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
            Retour à l'accueil
          </button>
          
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Nos Formations
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Découvrez notre gamme complète de formations en Intelligence Artificielle, IoT et Automatisation
          </p>
        </div>

        {/* Filtres par domaine */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {domains.map((domain) => {
            const IconComponent = domain.icon;
            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedDomain === domain.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="font-semibold">{domain.name[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
            <Users className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {formations.length}+
            </h3>
            <p className="text-gray-600">Formations disponibles</p>
          </div>
          <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
            <Clock className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900">120h+</h3>
            <p className="text-gray-600">Heures de formation</p>
          </div>
          <div className="p-6 text-center bg-white shadow-lg rounded-2xl">
            <Star className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900">98%</h3>
            <p className="text-gray-600">Taux de satisfaction</p>
          </div>
        </div>

        {/* Grille des formations */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredFormations.map((formation) => (
            <div
              key={formation.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-105 ${
                formation.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {formation.popular && (
                <div className="py-2 text-center text-white bg-blue-600">
                  <span className="text-sm font-semibold">⭐ Populaire</span>
                </div>
              )}
              
              <div className="p-6">
                {/* En-tête formation */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {formation.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formation.duration}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        formation.level === 'Débutant' ? 'bg-green-100 text-green-800' :
                        formation.level === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formation.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-gray-600">
                  {formation.description}
                </p>

                {/* Formateur */}
                <div className="flex items-center mb-4 space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Formateur : {formation.instructor}</span>
                </div>

                {/* Fonctionnalités */}
                <div className="mb-4">
                  <h4 className="flex items-center mb-2 font-semibold text-gray-900">
                    <Zap className="w-4 h-4 mr-2 text-blue-600" />
                    Points clés
                  </h4>
                  <div className="space-y-1">
                    {formation.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prix et CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      {formation.price} €
                    </span>
                    <div className="text-sm text-gray-500">
                      Financement disponible
                    </div>
                  </div>
                  <button
                    onClick={() => handleInscription(formation)}
                    className="flex items-center px-6 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <span>S'inscrire</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucune formation */}
        {filteredFormations.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Aucune formation trouvée
            </h3>
            <p className="text-gray-600">
              Aucune formation disponible pour ce domaine pour le moment.
            </p>
          </div>
        )}

        {/* Section avantages */}
        <div className="p-8 mt-16 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
            Nos avantages
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Certification</h3>
              <p className="text-sm text-gray-600">Certification reconnue par l'État</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Support</h3>
              <p className="text-sm text-gray-600">Accompagnement personnalisé</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Flexible</h3>
              <p className="text-sm text-gray-600">Formation à votre rythme</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Pratique</h3>
              <p className="text-sm text-gray-600">Projets concrets et études de cas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormationsPage;