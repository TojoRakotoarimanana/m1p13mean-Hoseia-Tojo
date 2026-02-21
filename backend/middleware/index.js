const authenticateToken = require('./auth');
const { checkRole, adminOnly, boutiqueOnly, clientOnly, boutiqueOrAdmin, allRoles } = require('./roles');

// Middleware combiné : authentification + vérification de rôle
const requireAuth = (allowedRoles = ['admin', 'boutique', 'client']) => {
  return [
    authenticateToken,
    checkRole(allowedRoles)
  ];
};

// Exports pour faciliter l'utilisation
module.exports = {
  // Middlewares individuels
  authenticateToken,
  checkRole,
  
  // Middlewares de rôles spécifiques
  adminOnly: [authenticateToken, adminOnly],
  boutiqueOnly: [authenticateToken, boutiqueOnly],
  clientOnly: [authenticateToken, clientOnly],
  boutiqueOrAdmin: [authenticateToken, boutiqueOrAdmin],
  allRoles: [authenticateToken, allRoles],
  
  // Middleware combiné personnalisable
  requireAuth
};