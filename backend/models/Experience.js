// backend/models/Experience.js
/* const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Candidate = require('./Candidate');

const Experience = sequelize.define('Experience', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'experiences',
  timestamps: true,
});

// Relation avec Candidate
Candidate.hasMany(Experience, { foreignKey: 'candidateId', onDelete: 'CASCADE' });
Experience.belongsTo(Candidate, { foreignKey: 'candidateId' });

module.exports = Experience;
 */

// backend/models/Experience.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Experience = sequelize.define('Experience', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' }, // map à user_id
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false, field: 'start_date' }, // map si colonne start_date
  endDate: { type: DataTypes.DATE, allowNull: true, field: 'end_date' },      // map si colonne end_date
  description: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'experiences',
  timestamps: true
});

// Association
Experience.belongsTo(User, { foreignKey: 'userId' });

module.exports = Experience;
