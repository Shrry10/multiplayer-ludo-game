const express = require("express");
const router = express.Router();
const controller = require("../controller/lobbyController");

router.get("/", (req, res) => {
  res.send("CREATE A NEW GAME OR JOIN AN EXISTING GAME.");
});
router.get("/:gid/players", controller.getPlayers)
router.get("/:gid/game", controller.getGame)
router.post("/join", controller.joinGame);

module.exports = router;
