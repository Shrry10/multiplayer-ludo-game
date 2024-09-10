import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const Lobby = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameReady, setGameReady] = useState(false);

  // Function to join or create a game
  const joinOrCreateGame = async () => {
    setLoading(true);

    try {
      // Fetch a game with 'waiting' status
      const response = await axios.post(`http://localhost:5000/lobby/join`, {
        userId: 9,
      });
      const gameId = response.data.gameid;

      const response2 = await axios.get(
        `http://localhost:5000/lobby/${gameId}/players`
      );
      setPlayers(response2.data.players);

      const response3 = await axios.get(
        `http://localhost:5000/lobby/${gameId}/game`
      );
      setGame(response3.data.gameInfo);
    } catch (error) {
      console.error("Failed to join or create game:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh the game state
  const refreshGameState = async () => {
    if (!game) return;

    try {
      const response2 = await axios.get(
        `http://localhost:5000/lobby/${game.id}/players`
      );
      setPlayers(response2.data.players);
      console.log(players);

      // If the game is full (4 players), redirect to the game
      if (players.length === 4) {
        setGameReady(true);
        const start = await axios.post(
          `http://localhost:5000/game/${game.id}/start`
        );

        // Automatically redirect after 2 seconds
        setTimeout(() => {
          router.push(`/ludo/${game.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to refresh game state:", error);
      alert("Unable to refresh. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Ludo Lobby</h1>

      {!game ? (
        <button
          onClick={joinOrCreateGame}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Game"}
        </button>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Game ID: {game.id}</h2>
          <h3 className="text-lg mb-2">User ID of players who have joined:</h3>
          {/* Safeguard players array before mapping */}
          {players.length > 0 ? (
            <ul className="list-disc">
              {players.map((player, index) => (
                <li key={index} className="text-lg">
                  {player.user_id}
                </li>
              ))}
            </ul>
          ) : (
            <p>No players have joined yet.</p>
          )}
          {!gameReady && (
            <>
              <button
                onClick={refreshGameState}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Refresh Player List
              </button>
              <p className="mt-4">Waiting for more players to join...</p>
            </>
          )}

          {gameReady && (
            <p className="text-green-500 mt-4">Game is ready! Redirecting...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Lobby;
