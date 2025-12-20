// backend/models/Competence.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Competence = sequelize.define('Competence', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nomCompetence: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'competences',
  timestamps: true
});

module.exports = Competence;
