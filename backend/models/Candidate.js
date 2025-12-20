// backend/models/Candidate.js
// backend/models/Diploma.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Diploma = sequelize.define('Diploma', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id' // correspond à ta colonne dans la base
  },
  level: { type: DataTypes.STRING, allowNull: false },
  university: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'diplomas',
  timestamps: false // pour ne pas générer createdAt/updatedAt
});

// Relation avec User
Diploma.belongsTo(User, { foreignKey: 'userId' });

module.exports = Diploma;
