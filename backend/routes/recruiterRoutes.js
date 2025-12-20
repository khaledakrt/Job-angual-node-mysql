// backend/routes/recruiterRoutes.js
const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadAvatar'); // ton fichier multer
const path = require('path'); // ✅ nécessaire pour path.extname
const Recruiter = require('../models/Recruiter');

// Dashboard / profil
router.get('/profile', authMiddleware, roleMiddleware('recruiter'), recruiterController.getProfile);
router.put('/profile', authMiddleware, roleMiddleware('recruiter'), recruiterController.updateProfile);
// Nouvelle route dashboard
router.get('/dashboard', authMiddleware, roleMiddleware('recruiter'), recruiterController.getDashboard);
// Gestion des jobs
router.get('/jobs', authMiddleware, roleMiddleware('recruiter'), recruiterController.listJobs);
router.post('/jobs', authMiddleware, roleMiddleware('recruiter'), recruiterController.createJob);
router.put('/jobs/:jobId', authMiddleware, roleMiddleware('recruiter'), recruiterController.updateJob);
router.delete('/jobs/:jobId', authMiddleware, roleMiddleware('recruiter'), recruiterController.deleteJob);

// Accès aux profils candidats
router.get('/candidates', authMiddleware, roleMiddleware('recruiter'), recruiterController.listCandidates);

router.post(
  '/profile/avatar',
  authMiddleware, // 1️⃣ auth d’abord
  upload,         // 2️⃣ Multer dynamique après auth
  async (req, res) => {
    console.log('Utilisateur connecté:', req.user);
    console.log('Fichier reçu:', req.file);

    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu' });

    try {
      const recruiter = await Recruiter.findOne({ where: { userId: req.user.id } });
      if (!recruiter) return res.status(404).json({ message: 'Recruteur non trouvé' });

      recruiter.avatar = `uploads/profiles/recruiter/user_${req.user.id}${path.extname(req.file.originalname)}`;
      await recruiter.save();

      res.json({ avatar: recruiter.avatar });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

module.exports = router;
