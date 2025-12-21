/* // backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes'); 

const app = express();

// Middleware
app.use(cors());
// ⚠️ express.json() ne doit pas parser multipart/form-data
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/application', applicationRoutes);
app.use('/jobs', jobRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('API Job Portal fonctionne !');
});

// Connexion DB
connectDB();

module.exports = app;
 */


// backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
require('./models/associations');

const { connectDB } = require('./config/db');
// ⚡ Importation de toutes les associations (doit venir avant toute utilisation des modèles)
const { Candidate, Job, Application, Diploma, FormationPrive, Experience, UserCompetence } = require('./models/associations');
const User = require('./models/User'); // si besoin

const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes'); 

const app = express();

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Middleware JSON uniquement pour les routes JSON
app.use('/api/auth', express.json({ limit: '5mb' }), authRoutes);
app.use('/api/candidate', express.json({ limit: '5mb' }), candidateRoutes);
app.use('/api/application', express.json({ limit: '5mb' }), applicationRoutes);
app.use('/jobs', express.json({ limit: '5mb' }), jobRoutes);

// ❌ Ne pas appliquer express.json() globalement pour le recruiterRoutes
app.use('/api/recruiter', recruiterRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API Job Portal fonctionne !');
});

// Connexion DB
connectDB();

module.exports = app;
