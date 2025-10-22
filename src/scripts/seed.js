import mongoose from 'mongoose';
import Formation from '../models/Formation';
require('dotenv').config();

const formationsData = [
  {
    title: {
      fr: 'Intelligence Artificielle',
      en: 'Artificial Intelligence',
      ar: 'الذكاء الاصطناعي'
    },
    description: {
      fr: 'Maîtrisez les algorithmes de machine learning, deep learning et les applications pratiques de l\'IA dans l\'industrie moderne.',
      en: 'Master machine learning algorithms, deep learning and practical AI applications in modern industry.',
      ar: 'أتقن خوارزميات التعلم الآلي والتعلم العميق وتطبيقات الذكاء الاصطناعي العملية في الصناعة الحديثة.'
    },
    category: 'ai',
    duration: '120h',
    level: 'intermédiaire',
    price: { amount: 2999, currency: 'EUR' },
    features: [
      { fr: 'Machine Learning', en: 'Machine Learning', ar: 'التعلم الآلي' },
      { fr: 'Deep Learning', en: 'Deep Learning', ar: 'التعلم العميق' },
      { fr: 'Computer Vision', en: 'Computer Vision', ar: 'الرؤية الحاسوبية' },
      { fr: 'NLP', en: 'NLP', ar: 'معالجة اللغة الطبيعية' }
    ]
  }
  // Ajouter les autres formations...
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Nettoyer la collection
    await Formation.deleteMany({});
    console.log('Cleared existing formations');

    // Insérer les nouvelles données
    await Formation.insertMany(formationsData);
    console.log('Database seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();