/* // backend/models/FormationPrive.js
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
 */


// backend/models/FormationPrive.js
// backend/models/FormationPrive.js
// backend/models/FormationPrive.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

class FormationPrive extends Model {}

FormationPrive.init({
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  centerFormation: { type: DataTypes.STRING(255), field: 'center_formation', allowNull: false },
  titreFormation: { type: DataTypes.STRING(255), field: 'titre_formation', allowNull: false },
  dateFormation: { type: DataTypes.DATEONLY, field: 'date_formation', allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'FormationPrive', tableName: 'formation_prive', timestamps: false });

FormationPrive.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = FormationPrive;
