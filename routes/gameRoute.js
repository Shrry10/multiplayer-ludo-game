const express = require("express");
const path = require("path");
const router = express.Router();
const controller = require("../controller/gameController");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const secretKey = "shrry";

// Middleware to authenticate JWT and extract user ID
const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
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

router.post("/:gid/start", authenticateJWT, controller.startGame);
router.post("/:gid/dice", authenticateJWT, controller.diceRoll);
router.get("/:gid/gameState", authenticateJWT, controller.gameState);
router.put("/:gid/update", authenticateJWT, controller.updateCoin);

module.exports = router;
