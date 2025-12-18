// backend/routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Dashboard / profil / CV
router.get('/profile', authMiddleware, roleMiddleware('candidate'), candidateController.getProfile);
router.put('/profile', authMiddleware, roleMiddleware('candidate'), candidateController.updateProfile);

// Liste des jobs
router.get('/jobs', authMiddleware, roleMiddleware('candidate'), candidateController.listJobs);

// Postuler à un job
router.post('/apply/:jobId', authMiddleware, roleMiddleware('candidate'), candidateController.applyJob);

// Historique des applications
router.get('/applications', authMiddleware, roleMiddleware('candidate'), candidateController.applicationHistory);

module.exports = router;
