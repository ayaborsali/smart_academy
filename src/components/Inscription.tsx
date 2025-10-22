import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, CreditCard, ArrowLeft, CheckCircle, Calendar, Shield, Star, Clock, Users, BookOpen, Zap, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ApiService from '../services/api';

const Inscription = ({ onNavigateToHome }) => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPack, setSelectedPack] = useState('standard');
  const [availablePacks, setAvailablePacks] = useState({});
  const [formations, setFormations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
    company: '',
    jobTitle: '',
    experience: '',
    selectedFormation: null,
    paymentMethod: 'card',
    termsAccepted: false
  });

  // Charger les données depuis le backend au montage du composant
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les formations depuis le backend
      const formationsData = await ApiService.getFormations();
      const formationsMap = {};
      formationsData.forEach(formation => {
        formationsMap[formation.id] = formation;
      });
      setFormations(formationsMap);

      // Charger les packs depuis le backend
      const packsData = await ApiService.getPacks();
      const packsMap = {};
      packsData.forEach(pack => {
        packsMap[pack.id] = {
          ...pack,
          icon: getPackIcon(pack.id)
        };
      });
      setAvailablePacks(packsMap);

      // Récupérer les données utilisateur stockées localement
      const userEmail = localStorage.getItem('userEmail');
      const selectedFormationId = localStorage.getItem('selectedFormationId');
      
      if (selectedFormationId && formationsMap[selectedFormationId]) {
        setUserData(prev => ({
          ...prev,
          email: userEmail || '',
          selectedFormation: formationsMap[selectedFormationId]
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Utiliser les données mockées en cas d'erreur
      const mockFormations = ApiService.getMockFormations();
      const mockPacks = ApiService.getMockPacks();
      
      const formationsMap = {};
      mockFormations.forEach(formation => {
        formationsMap[formation.id] = formation;
      });
      setFormations(formationsMap);

      const packsMap = {};
      mockPacks.forEach(pack => {
        packsMap[pack.id] = {
          ...pack,
          icon: getPackIcon(pack.id)
        };
      });
      setAvailablePacks(packsMap);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackIcon = (packId) => {
    const icons = {
      basic: BookOpen,
      standard: Users,
      premium: Star
    };
    return icons[packId] || BookOpen;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier la disponibilité de la formation
      if (userData.selectedFormation?.id) {
        await ApiService.checkFormationAvailability(userData.selectedFormation.id);
      }

      // Préparer les données pour l'API
      const inscriptionData = {
        ...userData,
        selectedPack: selectedPack,
        packDetails: packsToDisplay[selectedPack],
        language: language,
        inscriptionDate: new Date().toISOString(),
        status: 'pending'
      };

      // Soumettre l'inscription au backend
      const result = await ApiService.submitInscription(inscriptionData);

      // Envoyer l'email de confirmation
      await ApiService.sendConfirmationEmail(userData.email, {
        formation: userData.selectedFormation?.title,
        pack: packsToDisplay[selectedPack]?.name,
        totalPrice: getTotalPrice(),
        reference: result.reference
      });

      // Sauvegarder localement
      const finalInscriptionData = {
        ...inscriptionData,
        status: 'confirmed',
        reference: result.reference
      };
      
      localStorage.setItem('inscriptionData', JSON.stringify(finalInscriptionData));
      setIsSuccess(true);
      
      // Nettoyer après succès
      setTimeout(() => {
        localStorage.removeItem('selectedFormation');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('selectedFormationId');
      }, 3000);

    } catch (error) {
      console.error('Erreur inscription:', error);
      alert(t('inscription.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getTotalPrice = () => {
    const formationPrice = userData.selectedFormation?.price || 0;
    const packPrice = packsToDisplay[selectedPack]?.price || 0;
    return formationPrice + packPrice;
  };

  // Utilisez les données chargées depuis l'API ou les données mockées
  const packsToDisplay = availablePacks;
  const formationsToDisplay = formations;

  if (isLoading) {
    return (
      <section className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section className="min-h-screen py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="p-8 text-center bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {t('inscription.success.title')}
            </h1>
            <p className="mb-6 text-gray-600">
              {t('inscription.success.message')} <strong>{userData.selectedFormation?.title}</strong> 
              {t('inscription.withPack')} <strong>{packsToDisplay[selectedPack]?.name}</strong>.
            </p>
            
            <div className="p-6 mb-6 rounded-lg bg-gray-50">
              <h3 className="mb-3 font-semibold text-gray-900">{t('inscription.nextSteps')}</h3>
              <ul className="space-y-2 text-sm text-left text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('inscription.confirmationEmail')} {userData.email}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>{t('inscription.validationCall')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>{t('inscription.platformAccess')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>{t('inscription.formationStart')}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 mb-6 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-700">
                <strong>{t('payment.reference')}:</strong> CMD-{Date.now()}<br />
                <strong>{t('payment.pack')}:</strong> {packsToDisplay[selectedPack]?.name}<br />
                <strong>{t('payment.total')}:</strong> {getTotalPrice()} €<br />
                <strong>{t('payment.date')}:</strong> {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            <button
              onClick={onNavigateToHome}
              className="px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {t('button.backHome')}
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <button
            onClick={onNavigateToHome}
            className="flex items-center mb-4 space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('button.back')}</span>
          </button>
          
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('inscription.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('inscription.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Récapitulatif formation */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white shadow-lg rounded-2xl top-8">
              <h3 className="mb-4 text-xl font-bold text-gray-900">{t('formations.title')}</h3>
              
              {userData.selectedFormation ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{userData.selectedFormation.title}</h4>
                    <p className="text-sm text-gray-600">{userData.selectedFormation.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('payment.duration')} :</span>
                      <span className="font-semibold">{userData.selectedFormation.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('formations.level')} :</span>
                      <span className="font-semibold">{userData.selectedFormation.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('payment.formationPrice')} :</span>
                      <span className="font-semibold text-blue-600">{userData.selectedFormation.price} €</span>
                    </div>
                    {currentStep >= 3 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('payment.pack')} :</span>
                          <span className="font-semibold">{packsToDisplay[selectedPack]?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('payment.packSupplement')} :</span>
                          <span className="font-semibold text-green-600">+{packsToDisplay[selectedPack]?.price} €</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-base font-bold text-gray-900">{t('payment.total')} :</span>
                            <span className="text-lg font-bold text-blue-600">{getTotalPrice()} €</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">{t('formations.noneSelected')}</p>
              )}

              {/* Barre de progression */}
              <div className="mt-6">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>{t('inscription.step')} {currentStep} {t('inscription.of')} 4</span>
                  <span>{Math.round((currentStep / 4) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-4 mt-2 text-xs text-gray-500">
                  <span className="text-center">{t('inscription.step.personal').split(' ')[0]}</span>
                  <span className="text-center">{t('inscription.step.professional').split(' ')[0]}</span>
                  <span className="text-center">{t('inscription.step.pack').split(' ')[0]}</span>
                  <span className="text-center">{t('inscription.step.payment').split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire d'inscription */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-2xl">
              
              {/* Étape 1: Informations personnelles */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">
                    {t('inscription.step.personal')}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
                        {t('form.firstName')} *
                      </label>
                      <div className="relative">
                        <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={userData.firstName}
                          onChange={handleInputChange}
                          className="w-full py-3 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={t('form.firstName')}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
                        {t('form.lastName')} *
                      </label>
                      <div className="relative">
                        <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={userData.lastName}
                          onChange={handleInputChange}
                          className="w-full py-3 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={t('form.lastName')}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('form.email')} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full py-3 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('form.phone')} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="w-full py-3 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
                        {t('form.address')} *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required
                          value={userData.address}
                          onChange={handleInputChange}
                          className="w-full py-3 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={t('form.address')}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block mb-2 text-sm font-medium text-gray-700">
                        {t('form.postalCode')} *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        value={userData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700">
                        {t('form.city')} *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={userData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('form.city')}
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-700">
                        {t('form.country')} *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={userData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Tunisie">Tunisie</option>
                        <option value="France">France</option>
                        <option value="Algérie">Algérie</option>
                        <option value="Maroc">Maroc</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Informations professionnelles */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">
                    {t('inscription.step.professional')}
                  </h3>

                  <div>
                    <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('form.company')}
                    </label>
                    <div className="relative">
                      <Building className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={userData.company}
                        onChange={handleInputChange}
                        className="w-full py-3 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('form.company')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('form.jobTitle')}
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={userData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('form.jobTitle')}
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('form.experience')}
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={userData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t('form.experience.select')}</option>
                      <option value="débutant">{t('form.experience.beginner')}</option>
                      <option value="intermédiaire">{t('form.experience.intermediate')}</option>
                      <option value="expérimenté">{t('form.experience.experienced')}</option>
                      <option value="expert">{t('form.experience.expert')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Étape 3: Sélection du pack */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">
                    {t('inscription.step.pack')}
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {t('pack.chooseDescription')}
                  </p>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {Object.entries(packsToDisplay).map(([key, pack]) => {
                      const IconComponent = pack.icon;
                      return (
                        <div
                          key={key}
                          className={`relative p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                            selectedPack === key
                              ? 'border-blue-500 bg-blue-50 transform scale-105'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } ${pack.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                          onClick={() => setSelectedPack(key)}
                        >
                          {pack.popular && (
                            <div className="absolute top-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2">
                              <span className="px-4 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                                POPULAIRE
                              </span>
                            </div>
                          )}

                          <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg">
                              <IconComponent className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-gray-900">{pack.name}</h4>
                            <p className="mb-4 text-sm text-gray-600">{pack.description}</p>

                            <div className="mb-4">
                              <span className="text-2xl font-bold text-gray-900">{pack.price} €</span>
                              {pack.originalPrice > pack.price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {pack.originalPrice} €
                                </span>
                              )}
                            </div>

                            <ul className="space-y-3 text-sm text-left text-gray-600">
                              {pack.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <button
                              type="button"
                              className={`w-full mt-6 py-2 px-4 rounded-lg font-semibold transition-colors ${
                                selectedPack === key
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {selectedPack === key ? t('button.selected') : t('button.select')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 mt-6 rounded-lg bg-blue-50">
                    <h4 className="mb-2 font-semibold text-blue-900">{t('pack.whyChoose')}</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">{t('pack.accelerated')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">{t('pack.community')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">{t('pack.support')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 4: Paiement et finalisation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">
                    {t('inscription.step.payment')}
                  </h3>

                  <div>
                    <label className="block mb-4 text-sm font-medium text-gray-700">
                      {t('payment.method')}
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 space-x-3 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={userData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <span>{t('payment.card')}</span>
                      </label>

                      <label className="flex items-center p-4 space-x-3 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="transfer"
                          checked={userData.paymentMethod === 'transfer'}
                          onChange={handleInputChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <Building className="w-5 h-5 text-gray-400" />
                        <span>{t('payment.transfer')}</span>
                      </label>

                      <label className="flex items-center p-4 space-x-3 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="onSite"
                          checked={userData.paymentMethod === 'onSite'}
                          onChange={handleInputChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{t('payment.onSite')}</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="mb-3 font-semibold text-gray-900">{t('payment.summary')}</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>{t('payment.formation')} :</span>
                        <span className="font-semibold">{userData.selectedFormation?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('payment.pack')} :</span>
                        <span className="font-semibold">{packsToDisplay[selectedPack]?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('payment.duration')} :</span>
                        <span>{userData.selectedFormation?.duration}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span>{t('payment.formationPrice')} :</span>
                        <span>{userData.selectedFormation?.price} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('payment.packSupplement')} :</span>
                        <span>+{packsToDisplay[selectedPack]?.price} €</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold">{t('payment.total')} :</span>
                        <span className="font-bold text-blue-600">{getTotalPrice()} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      required
                      checked={userData.termsAccepted}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                      {t('payment.acceptTerms')} *
                    </label>
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t('button.previous')}
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {t('button.next')}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !userData.termsAccepted}
                    className="flex items-center px-8 py-3 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span>{t('button.processing')}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>{t('button.finalize')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inscription;