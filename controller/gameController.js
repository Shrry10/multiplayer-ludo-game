const pool = require("../db");

const changeTurn = async (gameid, playerid) => {
  const wonPlayer = await pool.query(
    "SELECT * FROM player WHERE game_id = $1 AND status = 'finished';",
    [gameid]
  );
  let winners = [];
  for (let i = 0; i < wonPlayer.rows.length; ++i) {
    const pcolor = wonPlayer.rows[i].color;
    if (pcolor === "red") winners.push(1);
    else if (pcolor === "green") winners.push(2);
    else if (pcolor === "yellow") winners.push(3);
    else winners.push(4);
  }
  let nextid = playerid;
  while (true) {
    nextid = (nextid % 4) + 1;
    if (!winners.includes(nextid)) {
      await pool.query("UPDATE turn SET player = $1 WHERE game_id = $2;", [
        nextid,
        gameid,
      ]);
      return;
    }
  }
};

module.exports = {
  startGame: async (req, res) => {
    // assuming game can be started by anyone
    const userid = req.headers.user_id;
    const gameid = req.params.gid;

    const gameInfo = await pool.query("SELECT * FROM game WHERE id = $1;", [
      gameid,
    ]);

    // handle where gameid is present in db, 400 bad req! game not found
    if (gameInfo.rows.length === 0) {
      res.status(400).json({
        message: `bad request! game with id ${gameid} doesn't exist`,
      });
      return;
    }

    // if 4 players have not yet joined
    const gameStatus = gameInfo.rows[0].status;
    if (
      gameStatus === "waiting" ||
      gameStatus === "in-progress" ||
      gameStatus !== "ready-to-start"
    ) {
      req.status(400).json({
        message: "bad request! not enough players or game is in-progress.",
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
      "INSERT INTO coin (user_id, game_id, player) VALUES ($2, $1, 1), ($2, $1, 1), ($2, $1, 1), ($2, $1, 1), ($3, $1, 2), ($3, $1, 2), ($3, $1, 2), ($3, $1, 2), ($4, $1, 3), ($4, $1, 3), ($4, $1, 3), ($4, $1, 3), ($5, $1, 4), ($5, $1, 4), ($5, $1, 4), ($5, $1, 4);",
      [gameid, playerid[0], playerid[1], playerid[2], playerid[3]]
    );

    res.status(200).json({
      message: "game started successfully",
      playerInfo: playerInfo.rows,
    });
  },

  updateCoin: async (req, res) => {
    // gameid and coinid in req params, steps in req body

    const gameid = req.params.gid;
    const coinid = req.params.cid;
    const steps = req.body.steps;

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
    if (gameInfo.rows[0].status !== "in-progress") {
      res.status(400).json({
        message: `bad request! game with id ${gameid} has not started`,
      });
      return;
    }

    const coinInfo = await pool.query("SELECT * FROM coin WHERE id = $1;", [
      coinid,
    ]);

    // verify if coin id is a part of this game
    if (coinInfo.rows.length === 0) {
      res.status(400).json({
        message: `bad request! coin with id ${coinid} is not a part of this game`,
      });
      return;
    }
    const curr_pos = coinInfo.rows[0].position;
    const inhome = coinInfo.rows[0].in_home;
    const playerid = coinInfo.rows[0].player;

    // verify if coin belongs to the player who has the turn
    const turnInfo = await pool.query(
      "SELECT * FROM turn WHERE game_id = $1;",
      [gameid]
    );
    if (turnInfo.rows[0].player !== playerid) {
      res.status(400).json({
        message: `bad request! not this player's turn`,
      });
      return;
    }

    // verify if the value is between 1-6
    if (steps < 1 || steps > 6) {
      res.status(400).json({
        message: `bad request! invalid dice roll`,
      });
      return;
    }

    // update coin position

    // if coin is inactive
    if (curr_pos === -1) {
      // if dice rolled 6
      if (steps === 6) {
        const update = await pool.query(
          "UPDATE coin SET position = $1 WHERE id = $2 RETURNING *;",
          [(playerid - 1) * 13, coinid]
        );
        res.status(200).json({
          message: "coin moved to the start",
          coinInfo: update.rows[0],
        });
        return;
      }
      // if dice rolled < 6
      else {
        res.status(403).json({
          message: "coin cannot move when inactive.",
        });
        return;
      }
    }
    // if coin is active
    else if (curr_pos > -1) {
      // if coin is in home path (position will be 1-5)
      if (inhome === 1) {
        // if dice rolled less than the number required to reach 6(finsih)
        if (curr_pos + steps < 6) {
          const update = await pool.query(
            "UPDATE coin SET position = $1 WHERE id = $2 RETURNING *;",
            [curr_pos + steps, coinid]
          );
          changeTurn(gameid, playerid);
          res.status(200).json({
            message: `coin moved ${steps} steps`,
            coinInfo: update.rows[0],
          });
          return;
        }
        // if dice rolled exactly the number required to reach 6(finsih)
        else if (curr_pos + steps === 6) {
          await pool.query(
            "UPDATE coin SET position = -2, in_home = 1 WHERE id = $1;",
            [coinid]
          );
          // check if player is finished with coins.
          const coin_home = await pool.query(
            "SELECT COUNT(*) FROM coin WHERE position = -2 AND game_id = $1 AND player = $2;",
            [gameid, playerid]
          );
          if (coin_home.rows[0].count == 4) {
            await pool.query(
              "UPDATE player SET status = 'finished', leave_ts = EXTRACT(EPOCH FROM NOW()) WHERE game_id = $1 AND user_id = $2;",
              [gameid, coinInfo.rows[0].user_id]
            );
            changeTurn(gameid, playerid);
          }
          res.status(200).json({
            message: "coin reached finish",
          });
          return;
        }
        // if dice rolled more than the number required to reach 6(finsih)
        else {
          res.status(403).json({
            message: `coin cannot move ${steps} steps`,
          });
          return;
        }
      }
      // if coin is not in home path
      else {
        // if dice rolled the number required to enter home path but not to finish (position between 1-5), (in_home = 1)
        const to_home = ((playerid - 1) * 13 + 50) % 52;
        if (
          curr_pos < to_home + 1 &&
          curr_pos + steps > to_home &&
          curr_pos + steps < to_home + 6
        ) {
          const update = await pool.query(
            "UPDATE coin SET position = $1, in_home = 1 WHERE id = $2 RETURNING *;",
            [curr_pos + steps - to_home, coinid]
          );
          if (steps !== 6) changeTurn(gameid, playerid);
          res.status(200).json({
            message: `coin moved ${steps} steps and entered home path`,
            coinInfo: update.rows[0],
          });
          return;
        }
        // if dice rolled exactly the number required to enter home path and finish
        else if (curr_pos < to_home + 1 && curr_pos + steps === to_home + 6) {
          await pool.query(
            "UPDATE coin SET position = -2, in_home = 1 WHERE id = $1;",
            [coinid]
          );
          // check if player is finished with coins.
          const coin_home = await pool.query(
            "SELECT COUNT(*) FROM coin WHERE position = -2 AND game_id = $1 AND player = $2;",
            [gameid, playerid]
          );
          if (coin_home.rows[0].count == 4) {
            await pool.query(
              "UPDATE player SET status = 'finished', leave_ts = EXTRACT(EPOCH FROM NOW()) WHERE game_id = $1 AND user_id = $2;",
              [gameid, coinInfo.rows[0].user_id]
            );
            changeTurn(gameid, playerid);
          }
          res.status(200).json({
            message: "coin reached finish",
          });
          return;
        }
        // normal play
        else {
          const new_pos = (curr_pos + steps) % 52;
          const update = await pool.query(
            "UPDATE coin SET position = $1 WHERE id = $2 RETURNING *;",
            [new_pos, coinid]
          );
          // if cuts a coin, update the cut coin
          const cut_coin = await pool.query(
            "UPDATE coin SET position = -1 WHERE in_home = 0 AND game_id = $1 AND player <> $2 AND position = $3 RETURNING *;",
            [gameid, playerid, new_pos]
          );
          // response if didn't cut a coin
          if (cut_coin.rows.length === 0) {
            if (steps !== 6) changeTurn(gameid, playerid);
            res.status(200).json({
              message: `coin moved ${steps} steps`,
              coinInfo: update.rows[0],
            });
            return;
          }
          // response if cut a coin
          else {
            res.status(200).json({
              message: `coin moved ${steps} steps and cut a coin`,
              coinInfo: update.rows[0],
              cutCoinInfo: cut_coin.rows[0],
            });
            return;
          }
        }
      }
    }
    // if coin already finsihed
    else {
      res.status(403).json({
        message: "coin already reached finish",
      });
      return;
    }
  },
};
