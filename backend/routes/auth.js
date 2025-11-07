import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import DeliveryPerson from '../models/DeliveryPerson.js';

const router = express.Router();

// Inscription utilisateur
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, phone, password, userType = 'customer', email } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let existingUser = await User.findOne({ phone });
    if (!existingUser && email) {
      existingUser = await User.findOne({ email });
    }
    
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec ce téléphone/email existe déjà' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur selon le type
    let newUser;
    if (userType === 'vendor') {
      newUser = new Vendor({
        firstName,
        lastName,
        phone,
        email,
        password: hashedPassword
      });
    } else if (userType === 'delivery') {
      newUser = new DeliveryPerson({
        firstName,
        lastName,
        phone,
        email,
        password: hashedPassword
      });
    } else {
      newUser = new User({
        firstName,
        lastName,
        phone,
        email,
        password: hashedPassword,
        userType
      });
    }

    await newUser.save();

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        userType: userType,
        phone: newUser.phone 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        email: newUser.email,
        userType
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { phone, password, userType = 'customer' } = req.body;

    // Chercher l'utilisateur selon le type
    let user;
    if (userType === 'vendor') {
      user = await Vendor.findOne({ phone });
    } else if (userType === 'delivery') {
      user = await DeliveryPerson.findOne({ phone });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Vérifier le statut du compte
    if (user.accountStatus && user.accountStatus !== 'active' && user.accountStatus !== 'approved') {
      return res.status(403).json({ 
        message: 'Compte suspendu ou en attente d\'approbation',
        status: user.accountStatus 
      });
    }

    // Mettre à jour la dernière connexion
    user.lastSeen = new Date();
    await user.save();

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: userType,
        phone: user.phone 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        userType,
        accountStatus: user.accountStatus
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Vérification du token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur selon le type
    let user;
    if (decoded.userType === 'vendor') {
      user = await Vendor.findById(decoded.userId).select('-password');
    } else if (decoded.userType === 'delivery') {
      user = await DeliveryPerson.findById(decoded.userId).select('-password');
    } else {
      user = await User.findById(decoded.userId).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        userType: decoded.userType,
        accountStatus: user.accountStatus
      }
    });

  } catch (error) {
    console.error('Erreur vérification token:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Mot de passe oublié
router.post('/forgot-password', async (req, res) => {
  try {
    const { phone, userType = 'customer' } = req.body;

    // Chercher l'utilisateur
    let user;
    if (userType === 'vendor') {
      user = await Vendor.findOne({ phone });
    } else if (userType === 'delivery') {
      user = await DeliveryPerson.findOne({ phone });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Générer un code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verification = {
      ...user.verification,
      verificationCode,
      codeExpiry
    };

    await user.save();

    // TODO: Envoyer le code par SMS
    console.log(`Code de vérification pour ${phone}: ${verificationCode}`);

    res.json({ message: 'Code de vérification envoyé par SMS' });

  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du code' });
  }
});

// Réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, verificationCode, newPassword, userType = 'customer' } = req.body;

    // Chercher l'utilisateur
    let user;
    if (userType === 'vendor') {
      user = await Vendor.findOne({ phone });
    } else if (userType === 'delivery') {
      user = await DeliveryPerson.findOne({ phone });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le code
    if (!user.verification?.verificationCode || 
        user.verification.verificationCode !== verificationCode ||
        user.verification.codeExpiry < new Date()) {
      return res.status(400).json({ message: 'Code de vérification invalide ou expiré' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.verification.verificationCode = undefined;
    user.verification.codeExpiry = undefined;

    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });

  } catch (error) {
    console.error('Erreur réinitialisation:', error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
  }
});

export default router;