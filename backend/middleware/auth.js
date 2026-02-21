const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded._id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou inactif.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

module.exports = authenticateToken;