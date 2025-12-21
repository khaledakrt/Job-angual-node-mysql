/* // backend/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // <-- déstructuration ici !

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('candidate', 'recruiter'), allowNull: false }
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;


 */
// backend/models/User.js
/* const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // ✅ assure-toi que c'est bien le chemin

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('candidate', 'recruiter'), allowNull: false },
  profilephoto: { type: DataTypes.STRING, field: 'profile_photo', allowNull: true } // <-- ton champ photo
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
 */

// models/User.js
// backend/models/User.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Model {}

User.init({
  role: { type: DataTypes.ENUM('candidate', 'recruiter'), allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  profile_photo: { type: DataTypes.STRING(255) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'User', tableName: 'users' });

module.exports = User;
