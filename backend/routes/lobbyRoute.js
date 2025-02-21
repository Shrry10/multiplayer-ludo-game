const express = require("express");
const router = express.Router();
const controller = require("../controller/lobbyController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.use(authenticateJWT);

router.get("/:gid/players", controller.getPlayers);
router.get("/:gid/game", controller.getGame);
router.get("/getUser", controller.getUserState);
router.post("/join", controller.joinGame);

module.exports = router;
