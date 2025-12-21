/* // backend/models/UserCompetence.js
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
 */

/* const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Competence = require('./Competence');

const UserCompetence = sequelize.define('UserCompetence', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'user_id'
  },
  competenceId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'competence_id'
  },
  niveau: { type: DataTypes.STRING, allowNull: true } // débutant, intermédiaire, avancé
}, {
  tableName: 'user_competences',
  timestamps: false // ❌ désactive createdAt / updatedAt
});

UserCompetence.belongsTo(User, { foreignKey: 'userId' });
UserCompetence.belongsTo(Competence, { foreignKey: 'competenceId' });

module.exports = UserCompetence; */



// backend/models/UserCompetence.js
// backend/models/UserCompetence.js
// backend/models/UserCompetence.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Competence = require('./Competence');

class UserCompetence extends Model {}

UserCompetence.init({
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  competence_id: { type: DataTypes.INTEGER, allowNull: false },
  niveau: { type: DataTypes.STRING(50) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'UserCompetence', tableName: 'user_competences', timestamps: false });

// Associations
UserCompetence.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserCompetence.belongsTo(Competence, { foreignKey: 'competence_id', as: 'competenceDetail' });

module.exports = UserCompetence;
