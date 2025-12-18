const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'Job',      // Nom de la base
  process.env.DB_USER || 'root',     // Utilisateur
  process.env.DB_PASSWORD || 'KHESTfr2024**', // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // mettre true pour voir les requêtes SQL
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base :', error);
  }
};

module.exports = { sequelize, connectDB };
