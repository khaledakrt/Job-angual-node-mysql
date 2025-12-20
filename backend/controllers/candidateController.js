// backend/controllers/candidateController.js

const Job = require('../models/Job');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const Diploma = require('../models/Diploma');
const FormationPrive = require('../models/FormationPrive');
const Experience = require('../models/Experience');
const Competence = require('../models/Competence');
const UserCompetence = require('../models/UserCompetence');

// -------------------- JOBS --------------------
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
    const existing = await Application.findOne({ where: { candidateId: req.user.id, jobId } });
    if (existing) return res.status(400).json({ message: 'Vous avez déjà postulé à ce job' });

    const application = await Application.create({ candidateId: req.user.id, jobId, status: 'pending' });
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

// -------------------- PROFILE --------------------
// Obtenir le profil complet
exports.getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      where: { userId: req.user.id },
      include: [
        { model: User, attributes: ['name', 'email', 'role'] },
        { model: Diploma },
        { model: FormationPrive },
        { model: Experience },
        { model: UserCompetence, include: [{ model: Competence, attributes: ['nomCompetence'] }] }
      ]
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
    if (!candidate) return res.status(404).json({ message: 'Candidate non trouvé' });

    candidate.phone = phone || candidate.phone;
    candidate.address = address || candidate.address;
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- DIPLOMAS --------------------
exports.addDiploma = async (req, res) => {
  try {
    const { level, university, year } = req.body;
    
    // ici, userId doit venir soit du token, soit de la session, ou du req.body
    const userId = req.user?.id; // par exemple si tu as l'auth middleware

    if (!userId) {
      return res.status(400).json({ error: 'User ID manquant' });
    }

    const diploma = await Diploma.create({
      userId,      // ← c'est crucial
      level,
      university,
      year,
      type: 'scolaire'
    });

    res.status(201).json(diploma);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateDiploma = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, university, year, type } = req.body;
    const diploma = await Diploma.findOne({ where: { id, userId: req.user.id } });
    if (!diploma) return res.status(404).json({ message: 'Diploma non trouvé' });

    diploma.level = level || diploma.level;
    diploma.university = university || diploma.university;
    diploma.year = year || diploma.year;
    diploma.type = type || diploma.type;
    await diploma.save();
    res.json(diploma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteDiploma = async (req, res) => {
  try {
    const { id } = req.params;
    const diploma = await Diploma.findOne({ where: { id, userId: req.user.id } });
    if (!diploma) return res.status(404).json({ message: 'Diploma non trouvé' });
    await diploma.destroy();
    res.json({ message: 'Diploma supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- FORMATIONS PRIVEES --------------------
exports.addFormationPrive = async (req, res) => {
  try {
    const { centerFormation, titreFormation, dateFormation } = req.body;
    const formation = await FormationPrive.create({
      userId: req.user.id,
      centerFormation,
      titreFormation,
      dateFormation
    });
    res.status(201).json(formation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateFormationPrive = async (req, res) => {
  try {
    const { id } = req.params;
    const { centerFormation, titreFormation, dateFormation } = req.body;
    const formation = await FormationPrive.findOne({ where: { id, userId: req.user.id } });
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });

    formation.centerFormation = centerFormation || formation.centerFormation;
    formation.titreFormation = titreFormation || formation.titreFormation;
    formation.dateFormation = dateFormation || formation.dateFormation;
    await formation.save();
    res.json(formation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteFormationPrive = async (req, res) => {
  try {
    const { id } = req.params;
    const formation = await FormationPrive.findOne({ where: { id, userId: req.user.id } });
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });
    await formation.destroy();
    res.json({ message: 'Formation supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- EXPERIENCES --------------------
exports.addExperience = async (req, res) => {
  try {
    const { title, company, startDate, endDate, description } = req.body;

    // Sequelize va mapper userId → user_id et startDate → start_date automatiquement grâce à `field` dans le modèle
    const experience = await Experience.create({
      userId: req.user.id,
      title,
      company,
      startDate,
      endDate,
      description
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeValidationError') {
      // renvoie les détails si un champ obligatoire manque
      return res.status(400).json({ errors: error.errors.map(e => e.message) });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, startDate, endDate, description } = req.body;
    const experience = await Experience.findOne({ where: { id, userId: req.user.id } });
    if (!experience) return res.status(404).json({ message: 'Experience non trouvée' });

    experience.title = title || experience.title;
    experience.company = company || experience.company;
    experience.startDate = startDate || experience.startDate;
    experience.endDate = endDate || experience.endDate;
    experience.description = description || experience.description;
    await experience.save();
    res.json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findOne({ where: { id, userId: req.user.id } });
    if (!experience) return res.status(404).json({ message: 'Experience non trouvée' });
    await experience.destroy();
    res.json({ message: 'Experience supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- COMPETENCES --------------------
exports.addUserCompetence = async (req, res) => {
  try {
    const { competenceId, niveau } = req.body;
    const userCompetence = await UserCompetence.create({
      userId: req.user.id,
      competenceId,
      niveau
    });
    res.status(201).json(userCompetence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateUserCompetence = async (req, res) => {
  try {
    const { id } = req.params;
    const { competenceId, niveau } = req.body;
    const userCompetence = await UserCompetence.findOne({ where: { id, userId: req.user.id } });
    if (!userCompetence) return res.status(404).json({ message: 'Compétence non trouvée' });

    userCompetence.competenceId = competenceId || userCompetence.competenceId;
    userCompetence.niveau = niveau || userCompetence.niveau;
    await userCompetence.save();
    res.json(userCompetence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteUserCompetence = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompetence = await UserCompetence.findOne({ where: { id, userId: req.user.id } });
    if (!userCompetence) return res.status(404).json({ message: 'Compétence non trouvée' });
    await userCompetence.destroy();
    res.json({ message: 'Compétence supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
