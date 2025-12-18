// backend/middleware/errorMiddleware.js
function errorMiddleware(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur interne',
  });
}

module.exports = errorMiddleware;
