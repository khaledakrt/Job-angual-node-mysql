// backend/models/Diploma.js
/* const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Diploma = sequelize.define('Diploma', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.STRING, allowNull: false },
  university: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'diplomas',
  timestamps: true,
});

module.exports = Diploma;
 */


// backend/models/Diploma.js
// backend/models/Diploma.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Diploma = sequelize.define('Diploma', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'user_id' // ← correspond à la colonne dans la base
  },
  level: { type: DataTypes.STRING, allowNull: false },
  university: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'scolaire' }
}, {
  tableName: 'diplomas',
  timestamps: true
});

// Relation
Diploma.belongsTo(User, { foreignKey: 'userId' });

module.exports = Diploma;
