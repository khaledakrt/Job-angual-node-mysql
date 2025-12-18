const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// 1️⃣ Public : toutes les offres actives
router.get('/all', jobController.getAllJobs);

// 2️⃣ Auth : offres du recruteur connecté
router.get('/my', authMiddleware, jobController.getMyJobs);

// Détail d'un job par ID
router.get('/:id', jobController.getJobById);

// Créer un job (recruteur seulement)
router.post('/', authMiddleware, jobController.createJob);

// Mettre à jour un job (recruteur seulement)
router.put('/:id', authMiddleware, jobController.updateJob);

// Supprimer un job (recruteur seulement)
router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router;
