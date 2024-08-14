const express = require("express");
const router = express.Router();
const controller = require("../controller/lobbyController");

router.get("/", (req, res) => {
  res.send("CREATE A NEW GAME OR JOIN AN EXISTING GAME.");
});
router.get("/create", controller.createGame)
router.get("/join", controller.joinGame);

module.exports = router;
