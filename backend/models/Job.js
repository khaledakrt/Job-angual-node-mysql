/* // backend/models/Job.js
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
  expiryDate: { type: DataTypes.DATE, allowNull: true }, // date limite de disponibilité
  experience: { type: DataTypes.STRING, allowNull: true }, // ✅ nouveau champ experience
}, {
  tableName: 'jobs',
  timestamps: true,
});

// ✅ Relation correcte
Job.belongsTo(Recruiter, { foreignKey: 'recruiterId', targetKey: 'userId', as: 'recruiter' });
Recruiter.hasMany(Job, { foreignKey: 'recruiterId', as: 'jobs' });

module.exports = Job;
 */

// backend/models/Job.js
// backend/models/Job.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Recruiter = require('./Recruiter'); // utiliser Recruiter, pas User

class Job extends Model {}

Job.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  recruiterId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    field: 'recruiter_id'
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM('full-time','part-time','internship','contract') },
  expiryDate: { type: DataTypes.DATE, allowNull: true }, // date limite de disponibilité
  experience: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  modelName: 'Job',
  tableName: 'jobs',
  timestamps: true,
});

// ⚡ Associations correctes
Job.belongsTo(Recruiter, { as: 'recruiter', foreignKey: 'recruiterId' });
Recruiter.hasMany(Job, { as: 'jobs', foreignKey: 'recruiterId' });

module.exports = Job;

