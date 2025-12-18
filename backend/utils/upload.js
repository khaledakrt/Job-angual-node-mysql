// backend/utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Stockage pour les photos de profil
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/profiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Stockage pour les CVs
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/cvs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadProfile = multer({ storage: profileStorage });
const uploadCV = multer({ storage: cvStorage });

module.exports = { uploadProfile, uploadCV };
