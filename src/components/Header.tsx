import React, { useState } from 'react';
import { Menu, X, Brain, Wifi, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.formations'), href: '/formations' },
    { name: t('nav.pack'), href: '/pack-iot' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const handleLogoClick = () => {
    // Fermer le menu mobile si ouvert
    setIsMenuOpen(false);
    
    // Réinitialiser l'état de l'application si nécessaire
    // Par exemple, vider le localStorage ou reset des states globaux
    localStorage.removeItem('scrollPosition');
    localStorage.removeItem('selectedFormation');
    
    // Naviguer vers la home page
    navigate('/');
    
    // Forcer le rechargement complet si nécessaire (déconseillé en React)
    // window.location.href = '/';
  };

  const handleContactUs = () => {
    setIsMenuOpen(false);
    navigate('/contact');
  };

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white/95 backdrop-blur-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo cliquable */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105 focus:outline-none"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">RIOT-SYS</h1>
              <p className="text-xs text-gray-600">Formation & Innovation</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                {item.name}
              </button>
            ))}
            <LanguageSelector />
            <button 
              onClick={handleContactUs}
              className="px-6 py-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {t('nav.contactUs')}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-4 border-t border-gray-200 md:hidden">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="font-medium text-left text-gray-700 transition-colors duration-200 hover:text-blue-600"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <LanguageSelector />
              </div>
              <button 
                onClick={handleContactUs}
                className="px-6 py-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 w-fit"
              >
                {t('nav.contactUs')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;