const Dice = ({
  playerNo,
  color,
  currentPlayer,
  diceValue,
  onDiceRoll,
  disabled,
}) => {
  const handleDiceClick = () => {
    if (currentPlayer === playerNo) {
      onDiceRoll(playerNo); // Roll dice if it's the player's turn
    } else {
      alert(`Wait for your turn!`);
    }
  };

  return (
    <div
      className="flex flex-col items-center"
      onClick={disabled ? () => {} : handleDiceClick}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-black cursor-pointer ${
          currentPlayer === playerNo ? "" : "opacity-50"
        }`}
      >
        <span className="text-xl font-bold">
          {currentPlayer === playerNo ? diceValue : ""}
        </span>
      </div>
      <span className={`mt-2 text-sm font-bold text-${color}-600`}>
        {color.charAt(0).toUpperCase() + color.slice(1)}
      </span>
    </div>
  );
};

export default Dice;
