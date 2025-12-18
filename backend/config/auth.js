// backend/config/auth.js
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpire: process.env.JWT_EXPIRE || '1d', // <== ici correspond à ce que tu importes
};
