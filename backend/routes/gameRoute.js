const express = require("express");
const router = express.Router();
const controller = require("../controller/gameController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.use(authenticateJWT);

router.post("/:gid/start", controller.startGame);
router.post("/:gid/dice", controller.diceRoll);
router.get("/:gid/gameState", controller.gameState);
router.put("/:gid/update", controller.updateCoin);

module.exports = router;
