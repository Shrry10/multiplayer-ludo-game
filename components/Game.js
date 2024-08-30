import { useState } from 'react';
import Board from './Board';

const Game = () => {
  // Game state: 16 coins (4 for each player), current player, dice value, and a message
  const [gameState, setGameState] = useState({
    coins: Array(16).fill({ position: 0, player_id: 1 }),
    diceState: {
      green: 5,  // Green player dice value
      yellow: 3, // Yellow player dice value
      red: 6,    // Red player dice value
      blue: 2    // Blue player dice value
    }
  });

  const [diceState, setDiceState] = useState({
    value: null,
    player_id: 1,
    color: 'red',
    valid_value: true,
  });

  // Function to move a coin
  const moveCoin = (coin_id) => {
    // Logic to move the coin based on dice value
    // This function updates gameState and moves the selected coin
    console.log(`Moving coin ${coin_id}`);
  };

  // Function to roll dice
  const rollDice = (player_id) => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceState((prev) => ({
      ...prev,
      value: newValue,
      player_id,
    }));

    // Update message and current player after rolling dice
    setGameState((prev) => ({
      ...prev,
      dice_value: newValue,
      message: `Player ${player_id} rolled a ${newValue}`,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Ludo Game</h1>
      <Board
        gameState={gameState}
        diceState={diceState}
        moveCoin={moveCoin}
        rollDice={rollDice}
      />
    </div>
  );
};

export default Game;
