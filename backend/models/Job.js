// backend/models/Job.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Recruiter = require('./Recruiter');

const Job = sequelize.define('Job', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  recruiterId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: Recruiter, key: 'id' },
    field: 'recruiter_id'
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM('full-time','part-time','internship','contract') },
  expiryDate: { type: DataTypes.DATE, allowNull: true } // date limite de disponibilité
}, {
  tableName: 'jobs',
  timestamps: true,
});

// ✅ Relation correcte
Job.belongsTo(Recruiter, { foreignKey: 'recruiterId', targetKey: 'id', as: 'recruiter' });
Recruiter.hasMany(Job, { foreignKey: 'recruiterId', as: 'jobs' });

module.exports = Job;
