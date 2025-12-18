// backend/models/User.js
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



