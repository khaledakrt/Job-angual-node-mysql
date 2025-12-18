// backend/models/Diploma.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Diploma = sequelize.define('Diploma', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.STRING, allowNull: false },
  university: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'diplomas',
  timestamps: true,
});

module.exports = Diploma;
