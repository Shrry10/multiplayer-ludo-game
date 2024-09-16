const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controller/lobbyController");

// Secret key for JWT
const secretKey = "shrry";

// Middleware to authenticate JWT and extract user ID
const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({ message: "Token has expired" });
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

router.get("/:gid/players", authenticateJWT, controller.getPlayers);
router.get("/:gid/game", authenticateJWT, controller.getGame);
router.get("/getUser", authenticateJWT, controller.getUserState)
router.post("/join", authenticateJWT, controller.joinGame);

module.exports = router;
