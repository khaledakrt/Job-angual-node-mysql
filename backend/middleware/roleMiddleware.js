// backend/middleware/roleMiddleware.js
function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Accès refusé pour ce rôle' });
    }

    next();
  };
}

module.exports = roleMiddleware;
