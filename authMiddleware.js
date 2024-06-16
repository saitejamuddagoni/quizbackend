const jwt = require('jsonwebtoken');

const dotenv = require("dotenv");
dotenv.config();

function authenticate(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}


function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.header('Authorization')) {
      return res.status(401).send('Not authenticated.');
    }

    const token = req.header('Authorization').split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.role;
      console.log(userRole)

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).send('Forbidden. You do not have the required permissions.');
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send('Invalid token.');
    }
  };
}

module.exports = {
    authenticate,
    authorize,
  };