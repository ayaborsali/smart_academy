import React, { useState } from 'react';
import { Brain, Wifi, Settings, ArrowRight, Users, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Formations = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [expandedFormation, setExpandedFormation] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState({});

  const formations = [
    {
      id: 1,
      icon: Brain,
      title: t('formations.ai.title'),
      description: t('formations.ai.description'),
      color: 'blue',
      features: [
        'Machine Learning - Apprentissage supervisé et non supervisé',
        'Deep Learning - Réseaux de neurones convolutifs et récurrents',
        'Computer Vision - Traitement et analyse d\'images',
        'NLP - Traitement du langage naturel et chatbots',
        'Data Science - Analyse et visualisation de données',
        'TensorFlow & PyTorch - Frameworks de deep learning'
      ],
      fullDescription: 'Cette formation complète en Intelligence Artificielle vous permettra de maîtriser les concepts fondamentaux du machine learning et deep learning. Vous apprendrez à développer des modèles prédictifs, des systèmes de reconnaissance d\'images et des applications NLP.',
      duration: '120h',
      level: 'Intermédiaire',
      price: 300,
    },
    {
      id: 2,
      icon: Wifi,
      title: t('formations.iot.title'),
      description: t('formations.iot.description'),
      color: 'green',
      features: [
        'Capteurs & Actionneurs - Types et implémentations',
        'Connectivité - WiFi, Bluetooth, LoRa, 5G',
        'Cloud IoT - Plateformes AWS IoT et Azure IoT',
        'Sécurité - Cryptographie et authentification',
        'Protocoles - MQTT, CoAP, HTTP pour IoT',
        'Edge Computing - Traitement en temps réel'
      ],
      fullDescription: 'Formation pratique sur l\'Internet des Objets couvrant la conception de dispositifs connectés, la collecte de données et l\'analyse en temps réel. Apprenez à développer des solutions IoT complètes.',
      duration: '100h',
      level: 'Débutant',
      price: 200,
    },
    {
      id: 3,
      icon: Settings,
      title: t('formations.automates.title'),
      description: t('formations.automates.description'),
      color: 'orange',
      features: [
        'PLC Programming - Langage Ladder et Structured Text',
        'SCADA - Supervision et contrôle industriel',
        'Industrial Networks - Profibus, Profinet, Ethernet/IP',
        'Maintenance 4.0 - Diagnostic prédictif',
        'Robotique Industrielle - Programmation de robots',
        'Sécurité Industrielle - Normes et certifications'
      ],
      fullDescription: 'Maîtrisez la programmation d\'automates industriels et les systèmes de contrôle-commande. Formation orientée pratique avec des études de cas réels.',
      duration: '80h',
      level: 'Intermédiaire',
      price: 199,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        border: 'border-blue-200',
        hover: 'hover:border-blue-300',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        border: 'border-green-200',
        hover: 'hover:border-green-300',
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700',
        border: 'border-orange-200',
        hover: 'hover:border-orange-300',
      },
    };
    return colors[color];
  };

  const handleLearnMore = (formation) => {
    localStorage.setItem('selectedFormation', JSON.stringify({
      title: formation.title,
      price: formation.price,
      duration: formation.duration,
      level: formation.level
    }));
    navigate('/login');
  };

  const toggleFormation = (formationId) => {
    if (expandedFormation === formationId) {
      setExpandedFormation(null);
    } else {
      setExpandedFormation(formationId);
      setShowAllFeatures(prev => ({ ...prev, [formationId]: false }));
    }
  };

  const toggleFeatures = (formationId, e) => {
    e.stopPropagation();
    setShowAllFeatures(prev => ({
      ...prev,
      [formationId]: !prev[formationId]
    }));
  };

  const getVisibleFeatures = (formation) => {
    if (showAllFeatures[formation.id]) {
      return formation.features;
    }
    return formation.features.slice(0, 2);
  };

  return (
    <section id="formations" className="py-20 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {t('formations.title')}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            {t('formations.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {formations.map((formation) => {
            const colors = getColorClasses(formation.color);
            const Icon = formation.icon;
            const isExpanded = expandedFormation === formation.id;
            const visibleFeatures = getVisibleFeatures(formation);
            
            return (
              <div
                key={formation.id}
                className={`${colors.bg} ${colors.border} ${colors.hover} border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
                onClick={() => toggleFormation(formation.id)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`${colors.icon} w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFormation(formation.id);
                    }}
                    className={`${colors.text} p-2 rounded-lg hover:bg-white transition-colors duration-200`}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <h3 className="mb-4 text-2xl font-bold text-gray-900">{formation.title}</h3>
                <p className="mb-6 leading-relaxed text-gray-600">{formation.description}</p>

                {/* Features avec voir plus/voir moins */}
                <div className="mb-6">
                  <h4 className={`${colors.text} font-semibold mb-3 text-lg`}>Compétences acquises :</h4>
                  <div className="space-y-2">
                    {visibleFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`${colors.text} bg-white px-4 py-3 rounded-lg text-sm font-medium border ${colors.border} transition-all duration-200 hover:shadow-md`}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {formation.features.length > 2 && (
                    <button 
                      onClick={(e) => toggleFeatures(formation.id, e)}
                      className={`${colors.text} mt-3 text-sm font-semibold flex items-center space-x-1 hover:underline`}
                    >
                      <span>{showAllFeatures[formation.id] ? 'Voir moins' : 'Voir plus'}</span>
                      {showAllFeatures[formation.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Contenu détaillé qui s'affiche quand on clique sur la carte */}
                {isExpanded && (
                  <div className="mt-6 p-4 bg-white rounded-lg border ${colors.border} animate-fadeIn">
                    <h4 className={`${colors.text} font-semibold mb-3 text-lg`}>Description détaillée :</h4>
                    <p className="mb-4 leading-relaxed text-gray-600">
                      {formation.fullDescription}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600"><strong>Durée :</strong> {formation.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600"><strong>Niveau :</strong> {formation.level}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prix et bouton */}
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {formation.price} DT
                    </span>
                    <p className="mt-1 text-sm text-gray-500">Prix TTC</p>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(formation);
                    }}
                    className={`${colors.button} text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 group-hover:shadow-lg transition-all duration-300 w-full justify-center`}
                  >
                    <span>{t('formations.learnMore')}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section hybride */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">{t('formations.hybrid.title')}</h3>
            </div>
            <p className="mb-6 text-lg text-gray-600">
              {t('formations.hybrid.description')}
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">💻</span>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">{t('formations.online')}</h4>
                <p className="text-sm text-gray-600">{t('formations.onlineDesc')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
                  <span className="text-2xl">🏢</span>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">{t('formations.inPerson')}</h4>
                <p className="text-sm text-gray-600">{t('formations.inPersonDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Formations;