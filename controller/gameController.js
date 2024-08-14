const pool = require("../db");

module.exports = {
  dice: async (req, res) => {
    //need game_id to know which game's player is rolling dice (extracting from headers for now)
    const gameid = req.headers.game_id;
    const roll = Math.floor(Math.random() * 6) + 1;

    // updating dice_roll in gamestate of the game with game_id, for the player with turn
    const gamestate_name = "gamestate" + gameid;
    await pool.query("UPDATE $1 SET dice_roll = $2 WHERE turn = 1"), [gamestate_name, roll];

    res.send(`Dice rolled ${roll}`);
  },
  updateCoin: async (req, res) => {
    // req body will conatain coin_id, dice_roll. Also need game_id (from headers for now).
    // game_id player_id coin_id steps
    // bad move - return enum
  },
};
