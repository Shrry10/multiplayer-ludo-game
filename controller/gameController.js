const pool = require("../db");

const getAllCoins = async (gameid) => {
  const coinInfo = await pool.query(
    "SELECT * FROM coin WHERE game_id = $1 ORDER BY player;",
    [gameid]
  );
  const coins = coinInfo.rows;

  return coins;
};

const changeTurn = async (gameid, playerno) => {
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
  let nextid = playerno;
  while (true) {
    nextid = (nextid % 4) + 1;
    if (!winners.includes(nextid)) {
      await pool.query("UPDATE turn SET player = $1 WHERE game_id = $2;", [
        nextid,
        gameid,
      ]);
      return nextid;
    }
  }
};

// create another function called movableCoins with boolean return type
let movableCoins = async (gameid, playerno, steps) => {
  const coinInfo = await pool.query(
    "SELECT * FROM coin WHERE game_id = $1 AND player = $2 ORDER BY id;",
    [gameid, playerno]
  );
  let coins = coinInfo.rows;
  let count = 0;
  // use for each
  coins.map((coin) => {
    if (coin.position < 0) {
      if (steps === 6 && coin.position === -1) {
        // coin.movable = 1;
        ++count;
      } else {
        // coin.movable = 0;
      }
    } else {
      // use braces for single line conditional statements
      if (coin.in_home === 1 && coin.position + steps > 6) {
        // coin.movable = 0;
      } else {
        // coin.movable = 1;
        ++count;
      }
    }
  });
  return count !== 0 ? true : false;
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
    const playerno = [
      playerInfo.rows[0].user_id,
      playerInfo.rows[1].user_id,
      playerInfo.rows[2].user_id,
      playerInfo.rows[3].user_id,
    ];
    const coinUpdate = await pool.query(
      "INSERT INTO coin (user_id, game_id, player) VALUES ($2, $1, 1), ($2, $1, 1), ($2, $1, 1), ($2, $1, 1), ($3, $1, 2), ($3, $1, 2), ($3, $1, 2), ($3, $1, 2), ($4, $1, 3), ($4, $1, 3), ($4, $1, 3), ($4, $1, 3), ($5, $1, 4), ($5, $1, 4), ($5, $1, 4), ($5, $1, 4);",
      [gameid, playerno[0], playerno[1], playerno[2], playerno[3]]
    );

    res.status(200).json({
      message: "game started successfully",
      playerInfo: playerInfo.rows,
    });
  },

  updateCoin: async (req, res) => {
    // gameid in req params, steps and coinid in req body

    const gameid = req.params.gid;
    const coinid = req.body.cid;
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
    const playerno = coinInfo.rows[0].player;

    // verify if coin belongs to the player who has the turn
    const turnInfo = await pool.query(
      "SELECT * FROM turn WHERE game_id = $1;",
      [gameid]
    );
    if (turnInfo.rows[0].player !== playerno) {
      res.status(400).json({
        message: `bad request! not this player's turn`,
      });
      return;
    }

    // verify if the value is between 1-6
    if (steps < 1 || steps > 6) {
      res.status(400).json({
        message: `bad request!`,
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
          [(playerno - 1) * 13, coinid]
        );
        res.status(200).json({
          message: "coin moved to the start",
          updatedCoinsInfo: await getAllCoins(gameid),
          nextTurn: playerno,
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
          let next_player_turn = await changeTurn(gameid, playerno);
          res.status(200).json({
            message: `coin moved ${steps} steps`,
            updatedCoinsInfo: await getAllCoins(gameid),
            nextTurn: next_player_turn,
          });
          return;
        }
        // if dice rolled exactly the number required to reach 6(finsih)
        else if (curr_pos + steps === 6) {
          const update = await pool.query(
            "UPDATE coin SET position = -2, in_home = 1 WHERE id = $1;",
            [coinid]
          );
          let next_player_turn = playerno;
          // check if player is finished with coins.
          const coin_home = await pool.query(
            "SELECT COUNT(*) FROM coin WHERE position = -2 AND game_id = $1 AND player = $2;",
            [gameid, playerno]
          );
          if (coin_home.rows[0].count === 4) {
            await pool.query(
              "UPDATE player SET status = 'finished', leave_ts = EXTRACT(EPOCH FROM NOW()) WHERE game_id = $1 AND user_id = $2;",
              [gameid, coinInfo.rows[0].user_id]
            );
            next_player_turn = await changeTurn(gameid, playerno);
          }
          res.status(200).json({
            message: "coin reached finish",
            updatedCoinsInfo: await getAllCoins(gameid),
            nextTurn: next_player_turn,
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
        const to_home = ((playerno - 1) * 13 + 50) % 52;
        if (
          curr_pos < to_home + 1 &&
          curr_pos + steps > to_home &&
          curr_pos + steps < to_home + 6
        ) {
          const update = await pool.query(
            "UPDATE coin SET position = $1, in_home = 1 WHERE id = $2 RETURNING *;",
            [curr_pos + steps - to_home, coinid]
          );
          let next_player_turn = playerno;
          if (steps !== 6)
            next_player_turn = await changeTurn(gameid, playerno);
          res.status(200).json({
            message: `coin moved ${steps} steps and entered home path`,
            updatedCoinsInfo: await getAllCoins(gameid),
            nextTurn: next_player_turn,
          });
          return;
        }
        // if dice rolled exactly the number required to enter home path and finish
        else if (curr_pos < to_home + 1 && curr_pos + steps === to_home + 6) {
          const update = await pool.query(
            "UPDATE coin SET position = -2, in_home = 1 WHERE id = $1;",
            [coinid]
          );
          let next_player_turn = playerno;
          // check if player is finished with coins.
          const coin_home = await pool.query(
            "SELECT COUNT(*) FROM coin WHERE position = -2 AND game_id = $1 AND player = $2;",
            [gameid, playerno]
          );
          if (coin_home.rows[0].count == 4) {
            await pool.query(
              "UPDATE player SET status = 'finished', leave_ts = EXTRACT(EPOCH FROM NOW()) WHERE game_id = $1 AND user_id = $2;",
              [gameid, coinInfo.rows[0].user_id]
            );
            next_player_turn = await changeTurn(gameid, playerno);
          }
          res.status(200).json({
            message: "coin reached finish",
            updatedCoinsInfo: await getAllCoins(gameid),
            nextTurn: next_player_turn,
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
          let next_player_turn = playerno;
          // if cuts a coin, update the cut coin
          const cut_coin = await pool.query(
            "UPDATE coin SET position = -1 WHERE in_home = 0 AND game_id = $1 AND player <> $2 AND position = $3 RETURNING *;",
            [gameid, playerno, new_pos]
          );
          // response if didn't cut a coin
          if (cut_coin.rows.length === 0) {
            if (steps !== 6)
              next_player_turn = await changeTurn(gameid, playerno);
            res.status(200).json({
              message: `coin moved ${steps} steps`,
              updatedCoinsInfo: await getAllCoins(gameid),
              nextTurn: next_player_turn,
            });
            return;
          }
          // response if cut a coin
          else {
            res.status(200).json({
              message: `coin moved ${steps} steps and cut a coin`,
              updatedCoinsInfo: await getAllCoins(gameid),
              nextTurn: next_player_turn,
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
  diceRoll: async (req, res) => {
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

    if (gameInfo.rows[0].status !== "in-progress") {
      res.status(400).json({
        message: `bad request! game with id ${gameid} has not started`,
      });
      return;
    }

    // change to player number
    const playerno = req.body.playerTurn;
    if (playerno < 1 || playerno > 4) {
      res.status(400).json({
        message: `bad request! player with id ${playerno} doesn't exist`,
      });
      return;
    }

    // verify if player has the turn
    const turnInfo = await pool.query(
      "SELECT * FROM turn WHERE game_id = $1;",
      [gameid]
    );
    if (turnInfo.rows[0].player != playerno) {
      res.status(400).json({
        message: `bad request! not player ${playerno}'s turn`,
      });
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    const isMovable = await movableCoins(gameid, playerno, roll);
    let next_player_turn = playerno;
    if (!isMovable) {
      next_player_turn = await changeTurn(gameid, playerno);
    }

    res.status(200).json({
      message: `dice rolled ${roll}`, // no need of message
      value: roll,
      // coins: coins, // remove this line
      playerTurn: next_player_turn, // change name to next_player_turn
    });
  },
  gameState: async (req, res) => {
    const gameid = req.params.gid;

    const coins = await getAllCoins(gameid);
    const turnInfo = await pool.query(
      "SELECT * FROM turn WHERE game_id = $1;",
      [gameid]
    );
    const next_player_turn = turnInfo.rows[0].player;

    res.status(200).json({
      coinInfo: coins,
      nextTurn: next_player_turn,
    });
  },
};
