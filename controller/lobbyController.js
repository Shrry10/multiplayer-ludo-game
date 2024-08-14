const pool = require("../db");

module.exports = {
  createGame: async (req, res) => {
    try {
      const userid = req.headers.user_id;

      // checking if player is already in a game
      const playerInfo = await pool.query(
        "SELECT * FROM player WHERE user_id = $1 ORDER BY join_ts DESC LIMIT 1;",
        [userid]
      );
      if (
        playerInfo.rows.length !== 0 &&
        playerInfo.rows[0].status == "in-progress"
      ) {
        res
          .status(500)
          .json({ message: "user already in a game" }, playerInfo.rows[0]);
      }

      // New Entry in Game Record
      const game = await pool.query(
        "INSERT INTO game (created_by, create_ts) VALUES ($1, EXTRACT(EPOCH FROM NOW())) RETURNING *;",
        [userid]
      );
      const gameid = game.rows[0].id;

      // // Creating new coin table, (FOREIGN KEY (player) REFERENCES gamestate(player) ON DELETE CASCADE ON UPDATE CASCADE) to be added later.
      // const coin_name = "coin" + gameid;
      // await pool.query(
      //   "CREATE TABLE $1 (id SERIAL PRIMARY KEY, player INTEGER NOT NULL, position INTEGER NOT NULL DEFAULT -1, in_home INTEGER NOT NULL DEFAULT 0, game_id INTEGER NOT NULL);",
      //   [coin_name]
      // );

      // // New 4 Entry to coin table
      // await pool.query(
      //   "INSERT INTO $1 (player, game_id) VALUES (1, $2), (1, $2), (1, $2), (1, $2);",
      //   [coin_name, gameid]
      // );

      // New Entry in Player Record
      const player = await pool.query(
        "INSERT INTO player (user_id, game_id, color, join_ts) VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW())) RETURNING *;",
        [userid, gameid, "red"]
      );

      res.status(201).json(
        {
          message: "game created successfully",
        },
        game.rows[0]
      );
    } catch (err) {
      console.error(err);
    }
  },
  joinGame: async (req, res) => {
    try {
      const userid = req.headers.user_id;

      /// checking if player is already in a game
      const playerInfo = await pool.query(
        "SELECT * FROM player WHERE user_id = $1 ORDER BY join_ts DESC LIMIT 1;",
        [userid]
      );
      if (
        playerInfo.rows.length !== 0 &&
        playerInfo.rows[0].status == "in-progress"
      ) {
        res
          .status(500)
          .json({ message: "user already in a game" }, playerInfo.rows[0]);
      }

      // checking if there is any game in waiting status.
      const gameInfo = await pool.query(
        "SELECT * FROM game WHERE status = 'waiting' ORDER BY create_ts DESC LIMIT 1;"
      );
      if (gameInfo.rows.length === 0) {
        res.status(404).json({ message: "no games available" });
      }
      const gameid = gameInfo.rows[0].id;

      // New 4 Entry to coin table
      // const coin_name = "coin" + gameid;
      // await pool.query(
      //   "INSERT INTO $1 (player, game_id) VALUES ($2, $3), ($2, $3), ($2, $3), ($2, $3);",
      //   [coin_name, players_now, gameid]
      // );

      // New Entry in Player Record
      const countInfo = await pool.query(
        "SELECT COUNT(*) FROM player WHERE game_id = $1;",
        [gameid]
      );
      let color = "";

      if (countInfo.rows[0].count == 1) color = "blue";
      else if (countInfo.rows[0].count == 2) color = "yellow";
      else {
        color = "green";
        await pool.query(
          "UPDATE game SET status = 'ready to start' WHERE id = $1;",
          [gameid]
        );
      }
      const player = await pool.query(
        "INSERT INTO player (user_id, game_id, color, join_ts) VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW())) RETURNING *;",
        [userid, gameid, color]
      );

      res
        .status(200)
        .json({ message: "game joined successfully" }, player.rows[0]);
    } catch (err) {
      console.error(err);
    }
  },
};
