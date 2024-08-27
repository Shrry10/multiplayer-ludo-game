const express = require("express");
const path = require("path");
const router = express.Router();
const controller = require("../controller/gameController");


router.post("/:gid/start", controller.startGame);
router.get("/:gid/dice/:pno", controller.diceRoll);
router.get("/:gid/gameState", controller.gameState);
router.put("/:gid/update/:cid", controller.updateCoin);

module.exports = router;
