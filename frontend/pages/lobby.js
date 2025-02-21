import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Lobby = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameReady, setGameReady] = useState(false);
  const [username, setUsername] = useState("");

  // Load initial player state and decode username on mount
  useEffect(() => {
    loadPlayerState();
    decodeUsernameFromToken();
  }, []);

  // Decode username from the JWT token
  const decodeUsernameFromToken = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(`${decodedToken.name}#${decodedToken.userId}`); // Assuming the token contains 'username'
    }
  };

  // Fetches the initial game state from the server
  const loadPlayerState = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found, please log in again.");
        router.push("/"); // Redirect to login page
        return;
      }

      const response = await axios.get(`${apiUrl}/lobby/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.userInfo.status === "in-progress") {
        router.push(`/ludo/${response.data.userInfo.game_id}`);
      }
    } catch (error) {
      console.error("Error fetching user state:", error);
    }
  };

  // Function to join or create a game
  const joinOrCreateGame = async () => {
    setLoading(true);

    try {
      // Fetch a game with 'waiting' status
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found, please log in again.");
        router.push("/"); // Redirect to login page
        return;
      }

      const response = await axios.post(
        `${apiUrl}/lobby/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const gameId = response.data.gameid;

      const response2 = await axios.get(
        `${apiUrl}/lobby/${gameId}/players`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlayers(response2.data.players);

      const response3 = await axios.get(
        `${apiUrl}/lobby/${gameId}/game`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found, please log in again.");
        router.push("/"); // Redirect to login page
        return;
      }

      const response2 = await axios.get(
        `${apiUrl}/lobby/${game.id}/players`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlayers(response2.data.players);

      // If the game is full (4 players), redirect to the game
      if (players.length === 4) {
        setGameReady(true);
        const start = await axios.post(
          `${apiUrl}/game/${game.id}/start`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    <div className="relative flex flex-col items-center justify-center min-h-screen">
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

      {/* Display logged in username at the bottom with fixed positioning */}
      <div className="fixed bottom-0 left-0 w-full text-center bg-gray-100 py-2">
        {username && (
          <p>
            You are logged in as{" "}
            <span className="font-semibold">{username}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
