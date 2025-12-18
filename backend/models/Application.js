// backend/models/Application.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // <-- déstructuration correcte
const Candidate = require('./Candidate');
const Job = require('./Job');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidateId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Candidate, key: 'id' } },
  jobId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Job, key: 'id' } },
  status: { type: DataTypes.ENUM('applied','interview','hired','rejected'), defaultValue: 'applied' },
  cv: { type: DataTypes.STRING }
}, {
  tableName: 'applications',
  timestamps: true,
});

Application.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Candidate.hasMany(Application, { foreignKey: 'candidateId', as: 'applications' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

module.exports = Application;
