const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Candidate uniquement
router.get('/', authMiddleware, roleMiddleware('candidate'), applicationController.getApplications);

// Recruiter : toutes les applications pour ses jobs
router.get('/recruiter', authMiddleware, roleMiddleware('recruiter'), applicationController.getApplicationsForRecruiter);

// Candidate : postuler à un job
router.post('/apply', authMiddleware, roleMiddleware('candidate'), applicationController.applyJob);

module.exports = router;
