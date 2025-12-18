// backend/controllers/recruiterController.js
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');
const Job = require('../models/Job');
const Candidate = require('../models/User'); // ici, on considère que les candidats sont des utilisateurs



// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { company, phone } = req.body;
    const recruiter = await Recruiter.findOne({ where: { userId: req.user.id } });
    if (!recruiter) return res.status(404).json({ message: 'Recruteur non trouvé' });

    recruiter.company = company || recruiter.company;
    recruiter.phone = phone || recruiter.phone;
    await recruiter.save();
    res.json(recruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Lister les jobs créés par le recruteur
exports.listJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { recruiterId: req.user.id } });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un job
exports.createJob = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const job = await Job.create({
      title,
      description,
      location,
      recruiterId: req.user.id
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.jobId, recruiterId: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job non trouvé' });

    const { title, description, location } = req.body;
    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.jobId, recruiterId: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job non trouvé' });

    await job.destroy();
    res.json({ message: 'Job supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Lister tous les candidats
exports.listCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({ where: { role: 'candidate' }, attributes: ['id', 'name', 'email'] });
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
// Récupérer le profil du recruteur
exports.getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'role', 'phone'] }]
    });

    if (!recruiter) return res.status(404).json({ message: 'Profil recruteur introuvable' });

    const profileData = {
      name: recruiter.User.name,
      email: recruiter.User.email,
      role: recruiter.User.role,
      phone: recruiter.phone,
      company: recruiter.company,
      description: recruiter.description || '',
      website: recruiter.website || '',
      address: recruiter.address || '',
      jobsCount: recruiter.jobsCount || 0,
      applicationsCount: recruiter.applicationsCount || 0
    };

    res.json(profileData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Dashboard du recruteur
exports.getDashboard = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'role'] }]
    });

    if (!recruiter) return res.status(404).json({ message: 'Profil recruteur introuvable' });

    // Récupérer les jobs du recruteur
    const jobs = await Job.findAll({ where: { recruiterId: recruiter.id } });

    // Préparer les données du dashboard
    const dashboardData = {
      profile: {
        name: recruiter.User.name,
        email: recruiter.User.email,
        role: recruiter.User.role,
        phone: recruiter.phone,
        company: recruiter.company,
        description: recruiter.description || '',
        website: recruiter.website || '',
        address: recruiter.address || ''
      },
      jobs: jobs
    };

    res.json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};