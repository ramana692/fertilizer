const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token, authorization denied' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Something went wrong with auth middleware', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Authorization middleware - check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };