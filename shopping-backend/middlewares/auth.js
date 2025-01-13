const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ error: 'Access denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};


const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
};


// Middleware pour vérifier si l'utilisateur est un vendeur
const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    // Les administrateurs peuvent également agir comme vendeurs
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Sellers only' });
  }
};

module.exports = { isAuthenticated, isAdmin, isSeller };
