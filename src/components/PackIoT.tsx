import React, { useState } from 'react';
import { 
  Package, Cpu, Wifi, Zap, Shield, Code, ArrowRight, 
  Brain, Settings, Loader, CheckCircle, X 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PackIoT = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // États pour les formulaires
  const [orderData, setOrderData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });

  const [demoData, setDemoData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    preferredDate: '',
    demoType: 'online'
  });

  const [brochureData, setBrochureData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    brochureType: 'digital'
  });

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

  // Fonction pour commander le pack IoT
  const handleOrderPack = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/iot/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Commande créée avec succès! Numéro: ${result.data.orderNumber}`
        });
        setShowOrderModal(false);
        setOrderData({ fullName: '', email: '', phone: '', company: '', address: '' });
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Erreur lors de la commande'
        });
      }
    } catch (error) {
      console.error('Erreur commande:', error);
      setMessage({
        type: 'error',
        text: 'Erreur de connexion au serveur'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour demande de démo
  const handleDemoRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/iot/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Demande de démo envoyée avec succès!'
        });
        setShowDemoModal(false);
        setDemoData({ 
          firstName: '', lastName: '', email: '', phone: '', 
          company: '', message: '', preferredDate: '', demoType: 'online' 
        });
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Erreur lors de la demande'
        });
      }
    } catch (error) {
      console.error('Erreur demande démo:', error);
      setMessage({
        type: 'error',
        text: 'Erreur de connexion au serveur'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour demande de brochure
  const handleBrochureRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/iot/brochure-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brochureData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Demande de brochure envoyée avec succès!'
        });
        setShowBrochureModal(false);
        setBrochureData({ 
          firstName: '', lastName: '', email: '', phone: '', 
          company: '', brochureType: 'digital' 
        });
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Erreur lors de la demande'
        });
      }
    } catch (error) {
      console.error('Erreur demande brochure:', error);
      setMessage({
        type: 'error',
        text: 'Erreur de connexion au serveur'
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset message après 5 secondes
  React.useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <section id="pack-iot" className="py-20 bg-white">
      {/* Message de notification */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <X className="w-5 h-5 mr-2" />
              )}
              <span>{message.text}</span>
            </div>
            <button 
              onClick={() => setMessage({ type: '', text: '' })}
              className="ml-4 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center px-6 py-3 mb-6 space-x-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100">
            <Package className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-blue-800">{t('pack.badge')}</span>
          </div>
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {t('pack.title')}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            {t('pack.subtitle')}
          </p>
        </div>

        <div className="grid items-center grid-cols-1 gap-12 mb-16 lg:grid-cols-2">
          <div>
            <h3 className="mb-8 text-3xl font-bold text-gray-900">{t('pack.features.title')}</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start p-4 space-x-4 transition-colors duration-200 bg-gray-50 rounded-xl hover:bg-gray-100">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">{t('pack.included.title')}</h3>
            <div className="space-y-4">
              {included.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-green-100 rounded-full">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-6 mt-8 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">{t('pack.price.complete')}</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">150dt</div>
                  <div className="text-sm text-gray-500 line-through">300dt</div>
                </div>
              </div>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="flex items-center justify-center w-full py-4 space-x-2 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl hover:from-blue-700 hover:to-green-700 group"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{t('pack.cta.order')}</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="mt-3 text-sm text-center text-gray-600">
                {t('pack.guarantee')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center text-white bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl">
          <h3 className="mb-4 text-3xl font-bold">{t('pack.transform.title')}</h3>
          <p className="mb-8 text-xl opacity-90">
            {t('pack.transform.subtitle')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button 
              onClick={() => setShowDemoModal(true)}
              className="px-8 py-4 font-semibold text-blue-600 transition-colors duration-200 bg-white rounded-xl hover:bg-gray-100"
              disabled={loading}
            >
              {t('pack.cta.demo')}
            </button>
            <button 
              onClick={() => setShowBrochureModal(true)}
              className="px-8 py-4 font-semibold text-white transition-all duration-200 border-2 border-white rounded-xl hover:bg-white hover:text-blue-600"
              disabled={loading}
            >
              {t('pack.cta.brochure')}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de commande */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Commander le Pack IoT</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleOrderPack} className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet *"
                value={orderData.fullName}
                onChange={(e) => setOrderData({...orderData, fullName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={orderData.email}
                onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone *"
                value={orderData.phone}
                onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Entreprise"
                value={orderData.company}
                onChange={(e) => setOrderData({...orderData, company: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Adresse"
                value={orderData.address}
                onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Confirmer la commande (150dt)'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de demande de démo */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Demander une démo</h3>
              <button onClick={() => setShowDemoModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleDemoRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom *"
                  value={demoData.firstName}
                  onChange={(e) => setDemoData({...demoData, firstName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom *"
                  value={demoData.lastName}
                  onChange={(e) => setDemoData({...demoData, lastName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email *"
                value={demoData.email}
                onChange={(e) => setDemoData({...demoData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={demoData.phone}
                onChange={(e) => setDemoData({...demoData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Entreprise"
                value={demoData.company}
                onChange={(e) => setDemoData({...demoData, company: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={demoData.demoType}
                onChange={(e) => setDemoData({...demoData, demoType: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="online">Démo en ligne</option>
                <option value="in_person">Démo en présentiel</option>
                <option value="video_call">Appel vidéo</option>
              </select>
              <textarea
                placeholder="Message"
                value={demoData.message}
                onChange={(e) => setDemoData({...demoData, message: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Demander une démo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de demande de brochure */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Demander une brochure</h3>
              <button onClick={() => setShowBrochureModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBrochureRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom *"
                  value={brochureData.firstName}
                  onChange={(e) => setBrochureData({...brochureData, firstName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom *"
                  value={brochureData.lastName}
                  onChange={(e) => setBrochureData({...brochureData, lastName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email *"
                value={brochureData.email}
                onChange={(e) => setBrochureData({...brochureData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={brochureData.phone}
                onChange={(e) => setBrochureData({...brochureData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Entreprise"
                value={brochureData.company}
                onChange={(e) => setBrochureData({...brochureData, company: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={brochureData.brochureType}
                onChange={(e) => setBrochureData({...brochureData, brochureType: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="digital">Brochure numérique</option>
                <option value="physical">Brochure physique</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Télécharger la brochure'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PackIoT;