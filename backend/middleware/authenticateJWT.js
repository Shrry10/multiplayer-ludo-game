const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT and extract user ID
const authenticateJWT = (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
  
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token has expired' });
          }
          return res.status(403).send({ message: "Invalid token" });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).send({ message: "No token provided" });
    }
  };

  module.exports = authenticateJWT;
