const pool = require("../db");

module.exports = {
  getPlayers: async (req, res) => {
    try {
      const gameid = req.params.gid;
      // verify if game exists and game is in progress
      const gameInfo = await pool.query("SELECT * FROM game WHERE id = $1;", [
        gameid,
      ]);
      if (gameInfo.rows.length === 0) {
        res.status(400).json({
          message: `bad request! game with id ${gameid} doesn't exist`,
        });
        return;
      }
      if (
        gameInfo.rows[0].status !== "waiting" &&
        gameInfo.rows[0].status !== "ready-to-start"
      ) {
        res.status(400).json({
          message: `bad request!`,
        });
        return;
      }

      // getting all the players waiting in the game lobby
      const playerInfo = await pool.query(
        "SELECT * FROM player WHERE game_id = $1 ORDER BY join_ts;",
        [gameid]
      );

      res.status(200).json({
        message: "Player List ready",
        players: playerInfo.rows,
      });
      return;
    } catch (err) {
      res.status(err.status).json({ message: err.message });
    }
  },
  joinGame: async (req, res) => {
    try {
      const userid = req.user.userId;
      const userInfo = await pool.query("SELECT * FROM users WHERE id = $1;", [
        userid,
      ]);

      /// checking if player is already in a game
      const playerInfo = await pool.query(
        "SELECT * FROM player WHERE user_id = $1 ORDER BY join_ts DESC LIMIT 1;",
        [userid]
      );
      if (
        playerInfo.rows.length !== 0 &&
        playerInfo.rows[0].status == "in-progress"
      ) {
        res.status(409).json({
          message: "conflict! user already in a game",
          playerDetails: playerInfo.rows[0],
        });
        return;
      }

      // checking if there is any game in waiting status.
      const gameInfo = await pool.query(
        "SELECT * FROM game WHERE status = 'waiting' ORDER BY create_ts DESC LIMIT 1;"
      );
      if (gameInfo.rows.length === 0) {
        // New Entry in Game Record
        const game = await pool.query(
          "INSERT INTO game (created_by, create_ts) VALUES ($1, EXTRACT(EPOCH FROM NOW())) RETURNING *;",
          [userid]
        );
        const gameId = game.rows[0].id;

        // New Entry in Player Record
        const player = await pool.query(
          "INSERT INTO player (user_id, game_id, color, join_ts, username) VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW()), $4) RETURNING *;",
          [userid, gameId, "red", userInfo.rows[0].username]
        );

        res.status(201).json({
          message: "game created successfully",
          gameid: gameId,
        });
        return;
      }
      const gameid = gameInfo.rows[0].id;

      // New Entry in Player Record
      const countInfo = await pool.query(
        "SELECT COUNT(*) FROM player WHERE game_id = $1;",
        [gameid]
      );
      let color = "";

      if (countInfo.rows[0].count == 1) color = "green";
      else if (countInfo.rows[0].count == 2) color = "yellow";
      else {
        color = "blue";
        await pool.query(
          "UPDATE game SET status = 'ready-to-start' WHERE id = $1;",
          [gameid]
        );
      }
      const player = await pool.query(
        "INSERT INTO player (user_id, game_id, color, join_ts, username) VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW()), $4) RETURNING *;",
        [userid, gameid, color, userInfo.rows[0].username]
      );

      res.status(200).json({
        message: "game joined successfully",
        gameid: gameid,
      });
    } catch (err) {
      res.status(err.status).json({ message: err.message });
    }
  },
  getGame: async (req, res) => {
    try {
      const gameid = req.params.gid;
      // verify if game exists and game is in progress
      const gameInfo = await pool.query("SELECT * FROM game WHERE id = $1;", [
        gameid,
      ]);
      if (gameInfo.rows.length === 0) {
        res.status(400).json({
          message: `bad request! game with id ${gameid} doesn't exist`,
        });
        return;
      }
      if (
        gameInfo.rows[0].status !== "waiting" &&
        gameInfo.rows[0].status !== "ready-to-start"
      ) {
        res.status(400).json({
          message: `bad request!`,
        });
        return;
      }

      res.status(200).json({
        message: "Game details ready",
        gameInfo: gameInfo.rows[0],
      });
      return;
    } catch (err) {
      res.status(err.status).json({ message: err.message });
    }
  },
  getUserState: async (req, res) => {
    const userid = req.user.userId;

    const userInfo = await pool.query(
      "SELECT * FROM player WHERE user_id = $1 ORDER BY join_ts DESC LIMIT 1;",
      [userid]
    );
    return res
      .status(200)
      .json({
        message: "Sending the user details",
        userInfo: userInfo.rows[0],
      });
  },
};
