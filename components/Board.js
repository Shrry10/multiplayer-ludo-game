import Dice from "./Dice";
import Coin from "./Coin";

const Board = ({
  gameState,
  currentPlayer,
  diceValue,
  coinMoved,
  onDiceRoll,
  onMoveCoin,
}) => {
  if (!gameState) return <div>Loading...</div>;

  // Function to render coins in the base (with placeholders)
  const renderBaseCoins = (coins, colorBaseSize = 4) => {
    const placeholders = Array(colorBaseSize).fill(null); // Array with empty placeholders
    coins.forEach((coin, index) => {
      placeholders[index] = coin; // Replace placeholders with coins if available
    });

    return placeholders.map((coin, index) => (
      <div
        key={index}
        className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-400 bg-white" // Coinholder (larger)
      >
        {coin.position === -1 ? (
          <Coin
            key={coin.id}
            coin={coin}
            onMoveCoin={onMoveCoin}
            steps={diceValue}
            size="w-12 h-12" // Make coins smaller here
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200"></div> // Placeholder (smaller)
        )}
      </div>
    ));
  };

  // Manually set grid positions for the north path (as per the Ludo path)
  const northGridPositions = [
    { id: 23, color: "white" },
    { id: 24, color: "white" },
    { id: 25, color: "white" },
    { id: 22, color: "white" },
    { id: 1, color: "#facc15" },
    { id: 26, color: "white" },
    { id: 21, color: "white" },
    { id: 2, color: "#facc15" },
    { id: 27, color: "white" },
    { id: 20, color: "white" },
    { id: 3, color: "#facc15" },
    { id: 28, color: "white" },
    { id: 19, color: "white" },
    { id: 4, color: "#facc15" },
    { id: 29, color: "white" },
    { id: 18, color: "white" },
    { id: 5, color: "#facc15" },
    { id: 30, color: "white" },
  ];

  // Manually set grid positions for the west path (as per the Ludo path)
  const westGridPositions = [
    { id: 12, color: "white" },
    { id: 13, color: "white" },
    { id: 14, color: "white" },
    { id: 15, color: "white" },
    { id: 16, color: "white" },
    { id: 17, color: "white" },
    { id: 11, color: "white" },
    { id: 1, color: "#16a34a" },
    { id: 2, color: "#16a34a" },
    { id: 3, color: "#16a34a" },
    { id: 4, color: "#16a34a" },
    { id: 5, color: "#16a34a" },
    { id: 10, color: "white" },
    { id: 9, color: "white" },
    { id: 8, color: "white" },
    { id: 7, color: "white" },
    { id: 6, color: "white" },
    { id: 5, color: "white" },
  ];

  // Manually set grid positions for the east path (as per the Ludo path)
  const eastGridPositions = [
    { id: 31, color: "white" },
    { id: 32, color: "white" },
    { id: 33, color: "white" },
    { id: 34, color: "white" },
    { id: 35, color: "white" },
    { id: 36, color: "white" },
    { id: 5, color: "#3b82f6" },
    { id: 4, color: "#3b82f6" },
    { id: 3, color: "#3b82f6" },
    { id: 2, color: "#3b82f6" },
    { id: 1, color: "#3b82f6" },
    { id: 37, color: "white" },
    { id: 43, color: "white" },
    { id: 42, color: "white" },
    { id: 41, color: "white" },
    { id: 40, color: "white" },
    { id: 39, color: "white" },
    { id: 38, color: "white" },
  ];

  // Manually set grid positions for the south path (as per the Ludo path)
  const southGridPositions = [
    { id: 4, color: "white" },
    { id: 5, color: "#dc2626" },
    { id: 44, color: "white" },
    { id: 3, color: "white" },
    { id: 4, color: "#dc2626" },
    { id: 45, color: "white" },
    { id: 2, color: "white" },
    { id: 3, color: "#dc2626" },
    { id: 46, color: "white" },
    { id: 1, color: "white" },
    { id: 2, color: "#dc2626" },
    { id: 47, color: "white" },
    { id: 0, color: "white" },
    { id: 1, color: "#dc2626" },
    { id: 48, color: "white" },
    { id: 51, color: "white" },
    { id: 50, color: "white" },
    { id: 49, color: "white" },
  ];

  // Function to find coins at a specific position and render them
  const renderCoinsInPosition = (position, color) => {
    let home = color === "white" ? 0 : 1;
    const colors = ["#dc2626", "#16a34a", "#facc15", "#3b82f6"];
    const coinsAtPosition = gameState.filter((coin) => {
      if (home === 1) {
        return (
          coin.in_home === home &&
          colors[coin.player - 1] === color &&
          coin.position === position
        );
      } else {
        return coin.position == position && coin.in_home == home;
      }
    });
    if (coinsAtPosition.length > 0) {
      return (
        <div className="flex space-x-1">
          {coinsAtPosition.map((coin) => (
            <Coin
              key={coin.id}
              coin={coin}
              onMoveCoin={onMoveCoin}
              steps={diceValue}
              size="w-8 h-8"
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dice holders for each player */}
      <div className="flex justify-around w-[800px] mb-4">
        {["red", "green", "yellow", "blue"].map((color, index) => (
          <Dice
            key={color}
            playerNo={index + 1}
            color={color}
            currentPlayer={currentPlayer}
            diceValue={diceValue}
            onDiceRoll={onDiceRoll}
            disabled={!coinMoved || currentPlayer !== index + 1} // Disable dice if coin hasn't moved or it's not the current player's turn
          />
        ))}
      </div>

      {/* Ludo Board */}
      <div className="grid grid-cols-[3fr_1.5fr_3fr] grid-rows-[3fr_1.5fr_3fr] w-[600px] h-[600px] border-4 border-black gap-0">
        {/* Green Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-green-600 p-8">
          {renderBaseCoins(gameState.slice(4, 8))}
        </div>

        {/* Empty Space */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          {northGridPositions.map((pos) => (
            <div
              key={pos.id + pos.color}
              className="relative flex items-center justify-center border border-black"
              style={{
                backgroundColor: pos.color, // Apply color based on grid position
              }}
            >
              {/* Show position number in the corner */}
              {/* <span className="absolute text-xs top-1 left-1">{pos.id}</span> */}

              {/* Render coins if any coin's position matches the grid cell's position */}
              {renderCoinsInPosition(pos.id, pos.color)}
            </div>
          ))}
        </div>

        {/* Yellow Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-yellow-400 p-8">
          {renderBaseCoins(gameState.slice(8, 12))}
        </div>

        {/* Empty Space Left */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          {westGridPositions.map((pos) => (
            <div
              key={pos.id + pos.color}
              className="relative flex items-center justify-center border border-black"
              style={{
                backgroundColor: pos.color, // Apply color based on grid position
              }}
            >
              {/* Show position number in the corner */}
              {/* <span className="absolute text-xs top-1 left-1">{pos.id}</span> */}

              {/* Render coins if any coin's position matches the grid cell's position */}
              {renderCoinsInPosition(pos.id, pos.color)}
            </div>
          ))}
        </div>

        {/* Center Area */}
        <div className="flex items-center justify-center border-2 border-black bg-purple-500 text-lg font-bold">
          Center Area
        </div>

        {/* Empty Space Right */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          {eastGridPositions.map((pos) => (
            <div
              key={pos.id + pos.color}
              className="relative flex items-center justify-center border border-black"
              style={{
                backgroundColor: pos.color, // Apply color based on grid position
              }}
            >
              {/* Show position number in the corner */}
              {/* <span className="absolute text-xs top-1 left-1">{pos.id}</span> */}

              {/* Render coins if any coin's position matches the grid cell's position */}
              {renderCoinsInPosition(pos.id, pos.color)}
            </div>
          ))}
        </div>

        {/* Red Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-red-600 p-8">
          {renderBaseCoins(gameState.slice(0, 4))}
        </div>

        {/* Empty Space */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          {southGridPositions.map((pos) => (
            <div
              key={pos.id + pos.color}
              className="relative flex items-center justify-center border border-black"
              style={{
                backgroundColor: pos.color, // Apply color based on grid position
              }}
            >
              {/* Show position number in the corner */}
              {/* <span className="absolute text-xs top-1 left-1">{pos.id}</span> */}

              {/* Render coins if any coin's position matches the grid cell's position */}
              {renderCoinsInPosition(pos.id, pos.color)}
            </div>
          ))}
        </div>

        {/* Blue Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-blue-500 p-8">
          {renderBaseCoins(gameState.slice(12, 16))}
        </div>
      </div>
    </div>
  );
};

export default Board;
