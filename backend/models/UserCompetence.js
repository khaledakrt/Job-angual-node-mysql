// backend/models/UserCompetence.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Competence = require('./Competence');

const UserCompetence = sequelize.define('UserCompetence', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  competenceId: { type: DataTypes.INTEGER, allowNull: false },
  niveau: { type: DataTypes.STRING, allowNull: true } // débutant, intermédiaire, avancé
}, {
  tableName: 'user_competences',
  timestamps: true
});

UserCompetence.belongsTo(User, { foreignKey: 'userId' });
UserCompetence.belongsTo(Competence, { foreignKey: 'competenceId' });

module.exports = UserCompetence;
