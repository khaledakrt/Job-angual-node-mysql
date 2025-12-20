const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {
  // Vérifie que req.user est défini par authMiddleware
  if (!req.user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = req.user.role === 'recruiter'
        ? 'uploads/profiles/recruiter'
        : 'uploads/profiles/candidat';
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, `user_${req.user.id}${path.extname(file.originalname)}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') cb(null, true);
    else cb(new Error('Format non autorisé'), false);
  };

  // Crée Multer avec storage dynamique
  multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })
    .single('avatar')(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next(); // Passe au middleware suivant (route finale)
    });
};
