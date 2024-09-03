import Dice from "./Dice";
import Coin from "./Coin";

const Board = ({
  gameState,
  currentPlayer,
  diceValue,
  onDiceRoll,
  onMoveCoin,
}) => {
  if (!gameState) return <div>Loading...</div>;

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
          />
        ))}
      </div>

      {/* Ludo Board */}
      <div className="grid grid-cols-[3fr_1.5fr_3fr] grid-rows-[3fr_1.5fr_3fr] w-[600px] h-[600px] border-4 border-black gap-0">
        {/* Green Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-green-600 p-10">
          {gameState.slice(4, 8).map((coin) => (
            <Coin
              key={coin.id}
              coin={coin}
              onMoveCoin={onMoveCoin}
              steps={diceValue}
            />
          ))}
        </div>

        {/* Empty Space */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Yellow Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-yellow-400 p-10">
          {gameState.slice(8, 12).map((coin) => (
            <Coin
            key={coin.id}
            coin={coin}
            onMoveCoin={onMoveCoin}
            steps={diceValue}
          />
          ))}
        </div>

        {/* Empty Space Left */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Center Area */}
        <div className="flex items-center justify-center border-2 border-black bg-purple-500 text-lg font-bold">
          Center Area
        </div>

        {/* Empty Space Right */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Red Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-red-600 p-10">
          {gameState.slice(0, 4).map((coin) => (
            <Coin
            key={coin.id}
            coin={coin}
            onMoveCoin={onMoveCoin}
            steps={diceValue}
          />
          ))}
        </div>

        {/* Empty Space */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Blue Base */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-blue-500 p-10">
          {gameState.slice(12, 16).map((coin) => (
            <Coin
            key={coin.id}
            coin={coin}
            onMoveCoin={onMoveCoin}
            steps={diceValue}
          />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
