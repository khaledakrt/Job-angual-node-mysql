/* const Job = require('../models/Job');
const { Op } = require('sequelize');
const now = new Date();
const Recruiter = require('../models/Recruiter');

// Créer une offre
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary, type, expiryDate } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Titre et description requis' });

    const job = await Job.create({
      recruiterId: req.user.id,
      title,
      description,
      location,
      salary,
      type,
      status: 'active',
      expiryDate: expiryDate || null
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 1️⃣ Toutes les offres actives (public) avec company
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { expiryDate: null },
          { expiryDate: { [Op.gte]: new Date() } }
        ]
      },
      include: [
        {
          association: 'recruiter', // doit correspondre à l'as du belongsTo
          attributes: ['company']    // récupère uniquement le champ company
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 2️⃣ Offres du recruteur connecté (auth)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: {
        recruiterId: req.user.id,  // filtre sur le recruteur connecté
        [Op.or]: [
          { expiryDate: null },
          { expiryDate: { [Op.gte]: new Date() } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Obtenir une offre par ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          association: 'recruiter',
          attributes: ['company'] // inclut company
        }
      ]
    });
    if (!job) return res.status(404).json({ message: 'Offre non trouvée' });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 

// Mettre à jour une offre
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre non trouvée' });

    const { title, description, location, salary, type, status, expiryDate } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.type = type || job.type;
    if (status) job.status = status;
    if (expiryDate) job.expiryDate = expiryDate;

    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une offre
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre non trouvée' });
    await job.destroy();
    res.json({ message: 'Offre supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


 */





const Job = require('../models/Job');
const { Op } = require('sequelize');
const Recruiter = require('../models/Recruiter');

// Fonction utilitaire pour calculer si un job est expiré
const getJobWithStatus = (job) => {
  const now = new Date();
  const isExpired = job.expiryDate ? new Date(job.expiryDate) < now : false;
  return {
    ...job.toJSON(),
    status: isExpired ? 'Expiré' : 'Active'
  };
};

// Créer une offre
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary, type, expiryDate } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Titre et description requis' });

    const job = await Job.create({
      recruiterId: req.user.id,
      title,
      description,
      location,
      salary,
      type,
      expiryDate: expiryDate || null  // plus de status ici
    });

    res.status(201).json(getJobWithStatus(job)); // status calculé à la volée
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// 1️⃣ Toutes les offres publiques
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          association: 'recruiter',
          attributes: ['company']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const jobsWithStatus = jobs.map(getJobWithStatus);
    res.json(jobsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 2️⃣ Offres du recruteur connecté
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { recruiterId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    const jobsWithStatus = jobs.map(getJobWithStatus);
    res.json(jobsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une offre par ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ association: 'recruiter', attributes: ['company'] }]
    });
    if (!job) return res.status(404).json({ message: 'Offre non trouvée' });
    res.json(getJobWithStatus(job));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une offre
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre non trouvée' });

    const { title, description, location, salary, type, expiryDate } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.type = type || job.type;
    if (expiryDate !== undefined) job.expiryDate = expiryDate;

    await job.save();
    res.json(getJobWithStatus(job));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une offre
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre non trouvée' });
    await job.destroy();
    res.json({ message: 'Offre supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
