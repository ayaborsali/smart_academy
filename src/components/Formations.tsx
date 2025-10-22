import React from 'react';
import { Brain, Wifi, Settings, ArrowRight, Users, Clock, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom'; // Si vous utilisez React Router

const Formations = () => {
  const { t } = useLanguage();
  const navigate = useNavigate(); // Pour la navigation

  const formations = [
    {
      icon: Brain,
      title: t('formations.ai.title'),
      description: t('formations.ai.description'),
      color: 'blue',
      features: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP'],
      duration: '120h',
      level: 'Intermédiaire',
      price: 2999,
    },
    {
      icon: Wifi,
      title: t('formations.iot.title'),
      description: t('formations.iot.description'),
      color: 'green',
      features: ['Capteurs & Actionneurs', 'Connectivité', 'Cloud IoT', 'Sécurité'],
      duration: '100h',
      level: 'Débutant',
      price: 2499,
    },
    {
      icon: Settings,
      title: t('formations.automates.title'),
      description: t('formations.automates.description'),
      color: 'orange',
      features: ['PLC Programming', 'SCADA', 'Industrial Networks', 'Maintenance 4.0'],
      duration: '80h',
      level: 'Intermédiaire',
      price: 1999,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        border: 'border-blue-200',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        border: 'border-green-200',
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700',
        border: 'border-orange-200',
      },
    };
    return colors[color as keyof typeof colors];
  };

  const handleLearnMore = (formation: any) => {
    // Stocker les informations de la formation pour l'inscription
    localStorage.setItem('selectedFormation', JSON.stringify({
      title: formation.title,
      price: formation.price,
      duration: formation.duration,
      level: formation.level
    }));

    // Rediriger vers la page de login
    navigate('/login');
    
    // Alternative: Ouvrir une modal de login
    // setShowLoginModal(true);
  };

  return (
    <section id="formations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('formations.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('formations.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {formations.map((formation, index) => {
            const colors = getColorClasses(formation.color);
            const Icon = formation.icon;
            
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                <div className={`${colors.icon} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{formation.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{formation.description}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{formation.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{formation.level}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formation.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className={`${colors.text} bg-white px-3 py-1 rounded-full text-sm font-medium border ${colors.border}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Prix */}
                  <div className="text-center mt-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formation.price} €
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleLearnMore(formation)}
                  className={`${colors.button} text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 group-hover:shadow-lg transition-all duration-300 w-full justify-center`}
                >
                  <span>{t('formations.learnMore')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Section hybride inchangée */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">{t('formations.hybrid.title')}</h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              {t('formations.hybrid.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💻</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('formations.online')}</h4>
                <p className="text-gray-600 text-sm">{t('formations.onlineDesc')}</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏢</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('formations.inPerson')}</h4>
                <p className="text-gray-600 text-sm">{t('formations.inPersonDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formations;