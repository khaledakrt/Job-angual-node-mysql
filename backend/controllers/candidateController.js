// backend/controllers/candidateController.js

const { Op } = require('sequelize');
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
    const existing = await Application.findOne({
      where: { candidateId: req.user.id, jobId }
    });
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
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: 'userProfile', // <-- alias corrigé
          attributes: ['name', 'email', 'role', 'profile_photo'],
          include: [
            { model: Diploma, as: 'diplomas' },
            { model: FormationPrive, as: 'formationsPrivees' },
            { model: Experience, as: 'experiences' },
            {
              model: UserCompetence,
              as: 'userCompetences',
              include: [
                { model: Competence, as: 'competenceLink', attributes: ['nom_competence'] }
              ]
            }
          ]
        }
      ]
    });

    if (!candidate) return res.status(404).json({ message: 'Candidate non trouvé' });

    const userData = candidate.userProfile.toJSON(); // <-- alias corrigé

    const profile = {
      id: candidate.id,
      phone: candidate.phone,
      address: candidate.address,
      summary: candidate.summary || '',
      user: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profile_photo: userData.profile_photo
      },
      diplomas: userData.diplomas || [],
      formationsPrivees: userData.formationsPrivees || [],
      experiences: userData.experiences || [],
      competences: userData.userCompetences || [],
      skills: (userData.userCompetences || []).map(uc => uc.competenceLink.nom_competence)
    };

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Mettre à jour le profil d’un candidat
exports.updateProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;
    const candidate = await Candidate.findOne({ where: { user_id: req.user.id }, include: { model: User, as: 'user' } });
    if (!candidate) return res.status(404).json({ message: 'Candidate non trouvé' });

    candidate.phone = phone || candidate.phone;
    candidate.address = address || candidate.address;
    await candidate.save();

    res.json({
      id: candidate.id,
      phone: candidate.phone,
      address: candidate.address,
      user: {
        name: candidate.user.name,
        email: candidate.user.email,
        role: candidate.user.role,
        profile_photo: candidate.user.profile_photo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// -------------------- DIPLOMAS --------------------
exports.addDiploma = async (req, res) => {
  try {
    const { level, university, year } = req.body;
    const diploma = await Diploma.create({
      user_id: req.user.id,
      level,
      university,
      year,
      type: 'scolaire'
    });
    res.status(201).json(diploma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateDiploma = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, university, year, type } = req.body;
    const diploma = await Diploma.findOne({ where: { id, user_id: req.user.id } });
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
    const diploma = await Diploma.findOne({ where: { id, user_id: req.user.id } });
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
      user_id: req.user.id,
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
    const formation = await FormationPrive.findOne({ where: { id, user_id: req.user.id } });
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
    const formation = await FormationPrive.findOne({ where: { id, user_id: req.user.id } });
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
    const experience = await Experience.create({
      user_id: req.user.id,
      title,
      company,
      startDate,
      endDate,
      description
    });
    res.status(201).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, startDate, endDate, description } = req.body;
    const experience = await Experience.findOne({ where: { id, user_id: req.user.id } });
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
    const experience = await Experience.findOne({ where: { id, user_id: req.user.id } });
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
    const competence = await Competence.findByPk(competenceId);
    if (!competence) return res.status(404).json({ message: 'Compétence introuvable' });

    const existing = await UserCompetence.findOne({ where: { user_id: req.user.id, competenceId } });
    if (existing) return res.status(400).json({ message: 'Compétence déjà ajoutée' });

    const userCompetence = await UserCompetence.create({
      user_id: req.user.id,
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
    const { niveau } = req.body;
    const userCompetence = await UserCompetence.findOne({ where: { id, user_id: req.user.id } });
    if (!userCompetence) return res.status(404).json({ message: 'Compétence non trouvée' });

    userCompetence.niveau = niveau || userCompetence.niveau;
    await userCompetence.save();
    res.json({ message: 'Compétence modifiée', userCompetence });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteUserCompetence = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompetence = await UserCompetence.findOne({ where: { id, user_id: req.user.id } });
    if (!userCompetence) return res.status(404).json({ message: 'Compétence non trouvée' });

    await userCompetence.destroy();
    res.json({ message: 'Compétence supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.searchCompetences = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query manquante' });

    const competences = await Competence.findAll({
      where: { nomCompetence: { [Op.like]: `${query}%` } },
      limit: 10,
      order: [['nomCompetence', 'ASC']]
    });

    res.json(competences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- SUMMARY --------------------
exports.addSummary = async (req, res) => {
  try {
    const { summary } = req.body;
    const candidate = await Candidate.findOne({ where: { user_id: req.user.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidate non trouvé' });

    if (candidate.summary) return res.status(400).json({ message: 'Résumé déjà existant. Utilisez la modification.' });

    candidate.summary = summary;
    await candidate.save();
    res.status(201).json({ message: 'Résumé ajouté', summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateSummary = async (req, res) => {
  try {
    const { summary } = req.body;
    const candidate = await Candidate.findOne({ where: { user_id: req.user.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidate non trouvé' });

    candidate.summary = summary;
    await candidate.save();
    res.json({ message: 'Résumé modifié', summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteSummary = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ where: { user_id: req.user.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidate non trouvé' });

    candidate.summary = null;
    await candidate.save();
    res.json({ message: 'Résumé supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
