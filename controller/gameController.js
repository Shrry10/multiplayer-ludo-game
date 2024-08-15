const pool = require("../db");

module.exports = {
  startGame: async (req, res) => {
    // assuming game can be started by anyone
    const userid = req.headers.user_id;
    const gameid = req.params.gid;

    const gameInfo = await pool.query("SELECT * FROM game WHERE id = $1;", [
      gameid,
    ]);

    // if 4 players have not yet joined
    const gameStatus = gameInfo.rows[0].status;
    if (gameStatus == "waiting") {
      req.status(400).json({
        message: "bad request! player requirement did not meet.",
      });
      return;
    }

    // if 4 players have already joined
    const gameUpdate = await pool.query(
      "UPDATE game SET status = 'in-progress' WHERE id = $1;",
      [gameid]
    );

    // create 16 coins
    const playerInfo = await pool.query(
      "SELECT * FROM player WHERE game_id = $1;",
      [gameid]
    );
    const playerid = [
      playerInfo.rows[0].user_id,
      playerInfo.rows[1].user_id,
      playerInfo.rows[2].user_id,
      playerInfo.rows[3].user_id,
    ];
    const coinUpdate = await pool.query(
      "INSERT INTO coin (user_id, game_id) VALUES ($2, $1), ($2, $1), ($2, $1), ($2, $1), ($3, $1), ($3, $1), ($3, $1), ($3, $1), ($4, $1), ($4, $1), ($4, $1), ($4, $1), ($5, $1), ($5, $1), ($5, $1), ($5, $1);",
      [gameid, playerid[0], playerid[1], playerid[2], playerid[3]]
    );

    res.status(200).json({
      message: "game started successfully",
      playerInfo: playerInfo.rows,
    });
  },
  updateCoin: async (req, res) => {
    // req body will conatain coin_id, dice_roll. Also need game_id (from headers for now).
    // game_id player_id coin_id steps
    // bad move - return enum
  },
};
