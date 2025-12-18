// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const { jwtSecret, jwtExpire } = require('../config/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, company } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    if (role === 'candidate') {
      if (!phone || !address) {
        return res.status(400).json({ message: 'Téléphone et adresse requis pour un candidat' });
      }
    } else if (role === 'recruiter') {
      if (!company) {
        return res.status(400).json({ message: 'Le champ company est requis pour un recruteur' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    if (role === 'candidate') {
      await Candidate.create({ userId: user.id, phone, address });
    } else if (role === 'recruiter') {
      await Recruiter.create({ userId: user.id, company, phone });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpire });
console.log('JWT token généré :', token);

const { password: _, ...userData } = user.toJSON(); // exclure mot de passe
res.status(201).json({ user: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpire });
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
