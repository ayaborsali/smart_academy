import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleDiscoverFormations = () => {
    navigate('/formations');
  };

  const handleWatchPresentation = () => {
    // Ouvrir la vidéo de présentation ou rediriger vers la page de présentation
    alert('Ouverture de la vidéo de présentation...');
  };

  return (
    <section id="home" className="relative flex items-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-flex px-4 py-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full animate-pulse">
              {t('hero.badge')}
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
            {t('hero.title.master')}
            <span className="text-transparent text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {t('hero.title.ai')}
            </span>
            {t('hero.title.and')}
            <span className="text-transparent text-green-600 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text">
              {t('hero.title.iot')}
            </span>
            <br />
            {t('hero.title.andThe')}
            <span className="text-transparent text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
              {t('hero.title.automates')}
            </span>
          </h1>
          
          <p className="max-w-4xl mx-auto mb-12 text-xl leading-relaxed text-gray-600 md:text-2xl">
            {t('hero.description')}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row">
            <button 
              onClick={handleDiscoverFormations}
              className="flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-300 transform bg-blue-600 shadow-lg group rounded-xl hover:bg-blue-700 hover:scale-105 hover:shadow-xl"
            >
              <span>{t('hero.cta.discover')}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            
            <button 
              onClick={handleWatchPresentation}
              className="flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-gray-700 transition-all duration-300 transform bg-white border border-gray-200 shadow-lg group rounded-xl hover:bg-gray-50 hover:scale-105 hover:shadow-xl"
            >
              <Play className="w-5 h-5 text-blue-600 transition-transform duration-200 group-hover:scale-110" />
              <span>{t('hero.cta.presentation')}</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto mt-16 md:grid-cols-3">
            <div className="text-center transition-transform duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-2 text-3xl font-bold text-blue-600 bg-blue-100 rounded-full">
                500+
              </div>
              <div className="font-medium text-gray-600">{t('hero.stats.students')}</div>
            </div>
            <div className="text-center transition-transform duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-2 text-3xl font-bold text-green-600 bg-green-100 rounded-full">
                95%
              </div>
              <div className="font-medium text-gray-600">{t('hero.stats.satisfaction')}</div>
            </div>
            <div className="text-center transition-transform duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-2 text-3xl font-bold text-orange-600 bg-orange-100 rounded-full">
                3
              </div>
              <div className="font-medium text-gray-600">{t('hero.stats.domains')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Éléments décoratifs animés */}
      <div className="absolute w-20 h-20 bg-blue-200 rounded-full top-20 left-10 opacity-20 animate-pulse"></div>
      <div className="absolute w-32 h-32 delay-1000 bg-green-200 rounded-full bottom-20 right-10 opacity-20 animate-pulse"></div>
      <div className="absolute w-16 h-16 delay-500 bg-orange-200 rounded-full top-1/2 right-20 opacity-20 animate-pulse"></div>
      <div className="absolute w-12 h-12 bg-purple-200 rounded-full bottom-40 left-20 opacity-20 animate-bounce"></div>
      
      {/* Lignes de fond décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-transparent blur-3xl opacity-30"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-100 to-transparent blur-3xl opacity-30"></div>
      </div>
    </section>
  );
};

export default Hero;