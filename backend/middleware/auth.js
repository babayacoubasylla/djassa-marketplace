import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import DeliveryPerson from '../models/DeliveryPerson.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token d\'authentification manquant' });
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

    // Vérifier le statut du compte
    if (user.accountStatus && user.accountStatus !== 'active' && user.accountStatus !== 'approved') {
      return res.status(403).json({ 
        message: 'Compte suspendu ou inactif',
        status: user.accountStatus 
      });
    }

    req.user = {
      userId: user._id,
      userType: decoded.userType,
      phone: user.phone,
      accountStatus: user.accountStatus
    };

    next();

  } catch (error) {
    console.error('Erreur authentification:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const vendorOnly = (req, res, next) => {
  if (req.user.userType !== 'vendor') {
    return res.status(403).json({ message: 'Accès réservé aux vendeurs' });
  }
  next();
};

export const deliveryOnly = (req, res, next) => {
  if (req.user.userType !== 'delivery') {
    return res.status(403).json({ message: 'Accès réservé aux livreurs' });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};