import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // For navigation
import Board from "./Board";

const Game = ({ gameid }) => {
  const router = useRouter(); // Initialize router
  const [gameState, setGameState] = useState(null); // Holds the game state (positions of all coins)
  const [players, setPlayers] = useState(null); // Holds the player usernames
  const [currentPlayer, setCurrentPlayer] = useState(null); // Track whose turn it is
  const [diceValue, setDiceValue] = useState(null); // Track the value of the dice roll
  const [coinMoved, setCoinMoved] = useState(true); // New state to track if a coin has been moved
  const [gameOver, setGameOver] = useState(false); // State to check if the game is over
  const [rankings, setRankings] = useState([]); // State to store player rankings

  // Load initial game state on mount
  useEffect(() => {
    loadGameState();
  }, []);

  // Fetches the initial game state from the server
  const loadGameState = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://localhost:5000/game/${gameid}/gameState`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.gameOver === true) {
        setGameOver(true);
        setRankings(response.data.rankings);
      } else {
        setGameState(response.data.coinInfo); // Set positions of all coins
        setPlayers(response.data.usernames);
        setCurrentPlayer(response.data.nextTurn); // Set which player will play next
      }
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  };

  // Handles dice roll
  const handleDiceRoll = async (playerNo) => {
    if (currentPlayer !== playerNo) {
      alert("It's not your turn!");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `http://localhost:5000/game/${gameid}/dice`,
        { playerTurn: playerNo }, // Include playerTurn in the body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { value, playerTurn } = response.data;

      setDiceValue(value);
      if (playerTurn !== playerNo) {
        setCurrentPlayer(playerTurn); // Switch to next player
      } else {
        setCoinMoved(false);
        alert(`You rolled a ${value}, now move a coin!`);
      }
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  // Handles moving a coin
  const handleMoveCoin = async (coinId, steps) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `http://localhost:5000/game/${gameid}/update`,
        {
          cid: coinId,
          steps: steps,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.gameOver === true) {
        setGameOver(true);
        setRankings(response.data.rankings); // Set player rankings when game is over
      } else {
        setGameState(response.data.updatedCoinsInfo);
        setCoinMoved(true);

        if (response.data.nextTurn === currentPlayer) {
          alert("You get another turn!");
        } else {
          setCurrentPlayer(response.data.nextTurn); // Switch to next player
        }
      }
    } catch (error) {
      console.error("Error moving coin:", error);
    }
  };

  // Redirect to the lobby page
  const goToLobby = () => {
    router.push("/lobby");
  };

  return (
    <div className="game-container flex flex-col items-center">
      {/* Conditionally display the Board if the game is not over */}
      {!gameOver && (
        <>
          <Board
            gameState={gameState}
            players={players}
            currentPlayer={currentPlayer}
            diceValue={diceValue}
            coinMoved={coinMoved}
            onDiceRoll={handleDiceRoll}
            onMoveCoin={handleMoveCoin}
          />
          <button
            onClick={loadGameState}
            className="mt-4 p-2 bg-gray-600 text-white rounded"
          >
            Update Game State
          </button>
        </>
      )}

      {/* Display Rankings and Lobby button when the game is over */}
      {gameOver && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Game Over - Rankings</h2>
          <ol className="mt-4 list-decimal list-inside">
            {rankings.map((player, index) => (
              <li key={index} className="text-lg">
                {player.username}{" "}
              </li>
            ))}
          </ol>

          {/* Lobby button to go back to the lobby */}
          <button
            onClick={goToLobby}
            className="mt-6 p-2 bg-blue-500 text-white rounded"
          >
            Go to Lobby
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
