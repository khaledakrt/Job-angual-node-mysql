// backend/models/associations.js
const User = require('./User');
const Candidate = require('./Candidate');
const Diploma = require('./Diploma');
const Experience = require('./Experience');
const FormationPrive = require('./FormationPrive');
const Competence = require('./Competence');
const UserCompetence = require('./UserCompetence');
const Application = require('./Application');
const Job = require('./Job');

// Candidate ↔ User
Candidate.belongsTo(User, { foreignKey: 'user_id', as: 'userProfile' });
User.hasOne(Candidate, { foreignKey: 'user_id', as: 'candidateProfile' });

// User ↔ Diplomas
User.hasMany(Diploma, { foreignKey: 'user_id', as: 'diplomas' });
Diploma.belongsTo(User, { foreignKey: 'user_id', as: 'diplomaOwner' });

// User ↔ Experiences
User.hasMany(Experience, { foreignKey: 'user_id', as: 'experiences' });
Experience.belongsTo(User, { foreignKey: 'user_id', as: 'experienceOwner' });

// User ↔ FormationsPrivees
User.hasMany(FormationPrive, { foreignKey: 'user_id', as: 'formationsPrivees' });
FormationPrive.belongsTo(User, { foreignKey: 'user_id', as: 'formationOwner' });

// User ↔ UserCompetences ↔ Competence
User.hasMany(UserCompetence, { foreignKey: 'user_id', as: 'userCompetences' });
UserCompetence.belongsTo(User, { foreignKey: 'user_id', as: 'userOwner' });

Competence.hasMany(UserCompetence, { foreignKey: 'competence_id', as: 'userCompetenceLinks' });
UserCompetence.belongsTo(Competence, { foreignKey: 'competence_id', as: 'competenceLink' });

// Application ↔ Candidate & Job
Application.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidateApp' });
Candidate.hasMany(Application, { foreignKey: 'candidate_id', as: 'applications' });

Application.belongsTo(Job, { foreignKey: 'job_id', as: 'jobApp' });
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });

// Job ↔ User (recruiter)
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'jobRecruiter' });  // <-- alias unique
User.hasMany(Job, { foreignKey: 'recruiterId', as: 'postedJobs' });    // <-- alias unique

module.exports = {
  User,
  Candidate,
  Diploma,
  Experience,
  FormationPrive,
  Competence,
  UserCompetence,
  Application,
  Job
};


