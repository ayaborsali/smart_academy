import React from 'react';
import { Brain, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white bg-gray-900">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-6 space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">RIOT-SYS</h3>
                <p className="text-sm text-gray-400">Formation & Innovation</p>
              </div>
            </div>
            <p className="max-w-md mb-6 leading-relaxed text-gray-300">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+216 XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">contact@smart-academy.tn</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">Tunis, Tunisie</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">{t('footer.formations')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#formations" className="text-gray-300 transition-colors duration-200 hover:text-blue-400">
                  {t('formations.ai.title')}
                </a>
              </li>
              <li>
                <a href="#formations" className="text-gray-300 transition-colors duration-200 hover:text-green-400">
                  {t('formations.iot.title')}
                </a>
              </li>
              <li>
                <a href="#formations" className="text-gray-300 transition-colors duration-200 hover:text-orange-400">
                  {t('formations.automates.title')}
                </a>
              </li>
              <li>
                <a href="#pack-iot" className="text-gray-300 transition-colors duration-200 hover:text-blue-400">
                  {t('pack.title')}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">{t('footer.resources')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 transition-colors duration-200 hover:text-blue-400">
                  <span>{t('footer.documentation')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 transition-colors duration-200 hover:text-blue-400">
                  <span>{t('footer.blog')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 transition-colors duration-200 hover:text-blue-400">
                  <span>{t('footer.caseStudies')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 transition-colors duration-200 hover:text-blue-400">
                  {t('footer.support')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">
              © {currentYear} RIOT-SYS. {t('footer.rights')}
            </p>
            <div className="flex items-center mt-4 space-x-6 md:mt-0">
              <a href="#" className="text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400">
                {t('footer.terms')}
              </a>
              <a href="http://www.smart-academy.tn" className="flex items-center space-x-1 text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400">
                <span>{t('footer.website')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;