// backend/models/Recruiter.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Recruiter = sequelize.define('Recruiter', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },

  // ✅ Ajout de description
  description: { 
    type: DataTypes.TEXT,  // texte long, chiffres, symboles
    allowNull: true         // peut être vide
  }
}, {
  tableName: 'recruiters',
  timestamps: true
});

Recruiter.belongsTo(User, { foreignKey: 'userId' });

module.exports = Recruiter;
