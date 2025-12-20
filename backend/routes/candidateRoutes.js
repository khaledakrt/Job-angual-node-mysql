// backend/routes/candidateRoutes.js
// backend/routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// -------------------- PROFILE / DASHBOARD --------------------
router.get('/profile', authMiddleware, roleMiddleware('candidate'), candidateController.getProfile);
router.put('/profile', authMiddleware, roleMiddleware('candidate'), candidateController.updateProfile);

// -------------------- JOBS --------------------
router.get('/jobs', authMiddleware, roleMiddleware('candidate'), candidateController.listJobs);
router.post('/apply/:jobId', authMiddleware, roleMiddleware('candidate'), candidateController.applyJob);
router.get('/applications', authMiddleware, roleMiddleware('candidate'), candidateController.applicationHistory);

// -------------------- DIPLOMAS --------------------
router.post('/diplomas', authMiddleware, roleMiddleware('candidate'), candidateController.addDiploma);
router.put('/diplomas/:id', authMiddleware, roleMiddleware('candidate'), candidateController.updateDiploma);
router.delete('/diplomas/:id', authMiddleware, roleMiddleware('candidate'), candidateController.deleteDiploma);

// -------------------- FORMATIONS PRIVEES --------------------
router.post('/formations-privees', authMiddleware, roleMiddleware('candidate'), candidateController.addFormationPrive);
router.put('/formations-privees/:id', authMiddleware, roleMiddleware('candidate'), candidateController.updateFormationPrive);
router.delete('/formations-privees/:id', authMiddleware, roleMiddleware('candidate'), candidateController.deleteFormationPrive);

// -------------------- EXPERIENCES --------------------
router.post('/experiences', authMiddleware, roleMiddleware('candidate'), candidateController.addExperience);
router.put('/experiences/:id', authMiddleware, roleMiddleware('candidate'), candidateController.updateExperience);
router.delete('/experiences/:id', authMiddleware, roleMiddleware('candidate'), candidateController.deleteExperience);

// -------------------- COMPETENCES --------------------
router.post('/competences', authMiddleware, roleMiddleware('candidate'), candidateController.addUserCompetence);
router.put('/competences/:id', authMiddleware, roleMiddleware('candidate'), candidateController.updateUserCompetence);
router.delete('/competences/:id', authMiddleware, roleMiddleware('candidate'), candidateController.deleteUserCompetence);

module.exports = router;
