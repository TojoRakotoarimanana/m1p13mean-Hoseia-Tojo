const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise.' });
    }

    if (!req.user.role) {
      return res.status(403).json({ message: 'Rôle utilisateur non défini.' });
    }

    // Vérifier si le rôle de l'utilisateur est autorisé
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé. Rôles autorisés: ${allowedRoles.join(', ')}. Votre rôle: ${req.user.role}` 
      });
    }

    next();
  };
};

// Middlewares spécifiques pour chaque rôle
const adminOnly = checkRole(['admin']);
const boutiqueOnly = checkRole(['boutique']);
const clientOnly = checkRole(['client']);
const boutiqueOrAdmin = checkRole(['admin', 'boutique']);
const allRoles = checkRole(['admin', 'boutique', 'client']);

module.exports = {
  checkRole,
  adminOnly,
  boutiqueOnly,
  clientOnly,
  boutiqueOrAdmin,
  allRoles
};