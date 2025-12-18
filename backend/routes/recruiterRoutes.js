// backend/routes/recruiterRoutes.js
const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

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

module.exports = router;
