/* // backend/models/Application.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('applied','interview','hired','rejected'), defaultValue: 'applied' },
  cv: { type: DataTypes.STRING }
}, {
  tableName: 'applications',
  timestamps: true
});

module.exports = Application;
 */
// backend/models/Application.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidate_id: { type: DataTypes.INTEGER, allowNull: false },
  job_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending','accepted','rejected'), defaultValue: 'pending' },
  applied_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'applications',
  timestamps: true
});

module.exports = Application;

