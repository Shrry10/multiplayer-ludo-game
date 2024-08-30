import Coin from './Coin';

const Board = ({ gameState, moveCoin, rollDice }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Dice Holders Above the Board */}
      <div className="flex justify-around w-[800px] mb-4">
        {/* Green Dice */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-black">
            <span className="text-xl font-bold">{gameState.diceState.green}</span>
          </div>
          <span className="mt-2 text-sm font-bold text-green-600">Green</span>
        </div>

        {/* Yellow Dice */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-black">
            <span className="text-xl font-bold">{gameState.diceState.yellow}</span>
          </div>
          <span className="mt-2 text-sm font-bold text-yellow-500">Yellow</span>
        </div>
      </div>

      {/* Ludo Board */}
      <div className="grid grid-cols-[3fr_1.5fr_3fr] grid-rows-[3fr_1.5fr_3fr] w-[600px] h-[600px] border-4 border-black gap-0">
        {/* Green Base - Top Left */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-green-600 p-10">
          {/* Green Base Coin Holders */}
          {gameState.coins.slice(0, 4).map((coin, index) => (
            <div key={index} className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <Coin coin={coin} moveCoin={() => moveCoin(index)} />
            </div>
          ))}
        </div>

        {/* Empty Space - Top Middle */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Yellow Base - Top Right */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-yellow-400 p-10">
          {/* Yellow Base Coin Holders */}
          {gameState.coins.slice(4, 8).map((coin, index) => (
            <div key={index} className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <Coin coin={coin} moveCoin={() => moveCoin(index)} />
            </div>
          ))}
        </div>

        {/* Empty Space - Middle Left */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Center Area */}
        <div className="flex items-center justify-center border-2 border-black bg-purple-500 text-lg font-bold">
          Center Area
        </div>

        {/* Empty Space - Middle Right */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Red Base - Bottom Left */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-red-600 p-10">
          {/* Red Base Coin Holders */}
          {gameState.coins.slice(8, 12).map((coin, index) => (
            <div key={index} className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <Coin coin={coin} moveCoin={() => moveCoin(index)} />
            </div>
          ))}
        </div>

        {/* Empty Space - Bottom Middle */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>

        {/* Blue Base - Bottom Right */}
        <div className="grid grid-cols-2 grid-rows-2 gap-12 border-2 border-black bg-blue-500 p-10">
          {/* Blue Base Coin Holders */}
          {gameState.coins.slice(12, 16).map((coin, index) => (
            <div key={index} className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
              <Coin coin={coin} moveCoin={() => moveCoin(index)} />
            </div>
          ))}
        </div>
      </div>

      {/* Dice Holders Below the Board */}
      <div className="flex justify-around w-[800px] mt-4">
        {/* Red Dice */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-black">
            <span className="text-xl font-bold">{gameState.diceState.red}</span>
          </div>
          <span className="mt-2 text-sm font-bold text-red-600">Red</span>
        </div>

        {/* Blue Dice */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-black">
            <span className="text-xl font-bold">{gameState.diceState.blue}</span>
          </div>
          <span className="mt-2 text-sm font-bold text-blue-500">Blue</span>
        </div>
      </div>
    </div>
  );
};

export default Board;
