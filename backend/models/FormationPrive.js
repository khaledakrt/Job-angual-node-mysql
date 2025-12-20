// backend/models/FormationPrive.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const FormationPrive = sequelize.define('FormationPrive', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_Id: { type: DataTypes.INTEGER, allowNull: false },
  centerFormation: { type: DataTypes.STRING, allowNull: false },
  titreFormation: { type: DataTypes.STRING, allowNull: false },
  dateFormation: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'formation_prive',
  timestamps: true
});

FormationPrive.belongsTo(User, { foreignKey: 'userId' });

module.exports = FormationPrive;
