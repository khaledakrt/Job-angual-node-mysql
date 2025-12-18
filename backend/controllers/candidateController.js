// backend/controllers/candidateController.js

const Job = require('../models/Job');
const Application = require('../models/Application');

// Liste des jobs
exports.listJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Postuler à un job
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Vérifier si déjà postulé
    const existing = await Application.findOne({
      where: { candidateId: req.user.id, jobId }
    });
    if (existing) return res.status(400).json({ message: 'Vous avez déjà postulé à ce job' });

    const application = await Application.create({
      candidateId: req.user.id,
      jobId,
      status: 'pending'
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Historique des applications
exports.applicationHistory = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { candidateId: req.user.id },
      include: [{ model: Job }]
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const Candidate = require('../models/Candidate');
const User = require('../models/User');

// Obtenir le profil d’un candidat
exports.getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'role'] }]
    });
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le profil d’un candidat
exports.updateProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;
    const candidate = await Candidate.findOne({ where: { userId: req.user.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidat non trouvé' });

    candidate.phone = phone || candidate.phone;
    candidate.address = address || candidate.address;
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
