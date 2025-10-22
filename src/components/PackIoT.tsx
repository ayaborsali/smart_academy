import React from 'react';
import { Package, Cpu, Wifi, Zap, Shield, Code, ArrowRight, Brain, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PackIoT = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cpu,
      title: t('pack.features.modules'),
      description: t('pack.features.modulesDesc')
    },
    {
      icon: Brain,
      title: t('pack.features.ai'),
      description: t('pack.features.aiDesc')
    },
    {
      icon: Settings,
      title: t('pack.features.plc'),
      description: t('pack.features.plcDesc')
    },
    {
      icon: Wifi,
      title: t('pack.features.connectivity'),
      description: t('pack.features.connectivityDesc')
    },
    {
      icon: Shield,
      title: t('pack.features.security'),
      description: t('pack.features.securityDesc')
    },
    {
      icon: Code,
      title: t('pack.features.dev'),
      description: t('pack.features.devDesc')
    }
  ];

  const included = [
    t('pack.included.kit'),
    t('pack.included.aiModules'),
    t('pack.included.plc'),
    t('pack.included.cloud'),
    t('pack.included.docs'),
    t('pack.included.support'),
    t('pack.included.projects'),
    t('pack.included.certification')
  ];

  return (
    <section id="pack-iot" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-green-100 px-6 py-3 rounded-full mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <span className="text-blue-800 font-semibold">{t('pack.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('pack.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pack.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('pack.features.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('pack.included.title')}</h3>
            <div className="space-y-4">
              {included.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">{t('pack.price.complete')}</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">2,999€</div>
                  <div className="text-sm text-gray-500 line-through">3,999€</div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 group">
                <span>{t('pack.cta.order')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <p className="text-center text-gray-600 text-sm mt-3">
                {t('pack.guarantee')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">{t('pack.transform.title')}</h3>
          <p className="text-xl mb-8 opacity-90">
            {t('pack.transform.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
              {t('pack.cta.demo')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
              {t('pack.cta.brochure')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackIoT;