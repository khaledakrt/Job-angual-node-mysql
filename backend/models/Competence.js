// backend/models/Competence.js
/* const { DataTypes } = require('sequelize');
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
 */




// backend/models/Competence.js

// backend/models/Competence.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Competence extends Model {}

Competence.init({
  nomCompetence: { type: DataTypes.STRING(255), field: 'nom_competence', allowNull: false },
  description: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Competence', tableName: 'competences', timestamps: false });

module.exports = Competence;
