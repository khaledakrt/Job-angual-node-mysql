// backend/models/Candidate.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'candidates',
  timestamps: true
});

Candidate.belongsTo(User, { foreignKey: 'userId' });

module.exports = Candidate;
