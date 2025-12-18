const Application = require('../models/Application');
const Job = require('../models/Job');

// Candidate : postuler à un job
exports.applyJob = async (req, res) => {
  try {
    const { jobId, cv } = req.body;
    if (!jobId || !cv) return res.status(400).json({ message: 'Job ID et CV requis' });

    const existing = await Application.findOne({
      where: { candidateId: req.user.id, jobId }
    });
    if (existing) return res.status(400).json({ message: 'Vous avez déjà postulé à ce job' });

    const application = await Application.create({
      candidateId: req.user.id,
      jobId,
      cv
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Candidate : toutes ses applications
exports.getApplications = async (req, res) => {
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

// Recruiter : toutes les applications pour ses jobs
exports.getApplicationsForRecruiter = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [{
        model: Job,
        where: { recruiterId: req.user.id }
      }]
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Optionnel : applications pour un job spécifique
exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId }
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
