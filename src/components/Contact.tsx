import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users, Award, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Réinitialiser le statut quand l'utilisateur modifie le formulaire
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {t('contact.title')}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h3 className="mb-8 text-2xl font-bold text-gray-900">{t('contact.info.title')}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">{t('contact.phone')}</h4>
                  <p className="text-gray-600">+216 XX XXX XXX</p>
                  <p className="text-sm text-gray-500">{t('contact.phoneHours')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">{t('contact.email')}</h4>
                  <p className="text-gray-600">borsaliaya1@gmail.com</p>
                  <p className="text-sm text-gray-500">{t('contact.emailResponse')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">{t('contact.address')}</h4>
                  <p className="text-gray-600">Tunis, Tunisie</p>
                  <p className="text-sm text-gray-500">{t('contact.addressNote')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 mt-12 bg-white shadow-sm rounded-xl">
              <h4 className="mb-4 font-bold text-gray-900">{t('contact.why.title')}</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{t('contact.why.experts')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{t('contact.why.flexible')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">{t('contact.why.certification')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">{t('contact.form.title')}</h3>
            
            {/* Messages de statut */}
            {submitStatus === 'success' && (
              <div className="flex items-center p-4 mb-6 space-x-3 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Message envoyé avec succès !</p>
                  <p className="text-sm text-green-700">{submitMessage}</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center p-4 mb-6 space-x-3 border border-red-200 rounded-lg bg-red-50">
                <XCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Erreur lors de l'envoi</p>
                  <p className="text-sm text-red-700">{submitMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-700">
                  {t('contact.form.company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                  {t('contact.form.subject')} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="ia">{t('formations.ai.title')}</option>
                  <option value="iot">{t('formations.iot.title')}</option>
                  <option value="automates">{t('formations.automates.title')}</option>
                  <option value="pack">{t('pack.title')}</option>
                  <option value="partenariat">Partenariat / Intégration</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez vos besoins et objectifs de formation..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-full py-4 space-x-2 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{t('contact.form.send')}</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-500">
              {t('contact.form.response')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;