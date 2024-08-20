const express = require("express");
const router = express.Router();
const controller = require("../controller/gameController");

// router.get("/", (req, res) => {
//     res.send("CREATE A NEW GAME OR JOIN AN EXISTING GAME.");
//   });
router.post("/:gid/start", controller.startGame);
router.put("/:gid/update/:cid", controller.updateCoin);

module.exports = router;
