/* // backend/models/Candidate.js
// backend/models/Candidate.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false } ,
  phone: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  summary: { type: DataTypes.TEXT, allowNull: true } // ← résumé ici
}, {
  tableName: 'candidates',
  timestamps: false
});

Candidate.belongsTo(User, { foreignKey: 'userId' });

module.exports = Candidate;
 */




// backend/models/Candidate.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

class Candidate extends Model {}

Candidate.init({
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  summary: { type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Candidate', tableName: 'candidates' });

// Association
Candidate.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Candidate;
