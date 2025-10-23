import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/riot_sys';
    
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('✅ Connexion MongoDB établie avec succès');
      console.log(`📁 Base de données: ${mongoose.connection.db.databaseName}`);
      console.log(`🏠 Hôte: ${mongoose.connection.host}`);
      console.log(`🔌 Port: ${mongoose.connection.port}`);
    })
    .catch(err => {
      console.error('❌ Erreur connexion MongoDB:', err.message);
      console.log('💡 Astuce: Assurez-vous que MongoDB est démarré localement');
      console.log('   Sur Windows: "mongod" dans un terminal administrateur');
      console.log('   Sur Mac/Linux: "sudo systemctl start mongod" ou "brew services start mongodb/brew/mongodb-community"');
    });

    // Gestion des événements MongoDB
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connecté à MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur Mongoose:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose déconnecté de MongoDB');
    });

    // Gestion propre de la fermeture
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Connexion MongoDB fermée (SIGINT)');
      process.exit(0);
    });
  }

  // Méthode pour vérifier l'état de la connexion
  getStatus() {
    return {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.db?.databaseName,
      models: Object.keys(mongoose.connection.models)
    };
  }

  // Méthode pour fermer la connexion
  async close() {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée manuellement');
  }
}

// Crée une instance unique (Singleton)
const database = new Database();

export default database;