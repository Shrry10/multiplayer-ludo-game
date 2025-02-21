const Dice = ({
  playerNo,
  name,
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

  // Function to generate dot positions for the dice faces
  const renderDiceDots = (value) => {
    const dotPatterns = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const dots = dotPatterns[value] || [];
    return Array.from({ length: 9 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          dots.includes(i) ? "bg-black" : ""
        }`}
      />
    ));
  };

  return (
    <div
      className="flex flex-col items-center"
      onClick={disabled ? () => {} : handleDiceClick}
    >
      <div
        className={`grid grid-cols-3 grid-rows-3 gap-1 p-2 w-12 h-12 bg-white rounded-lg border-2 border-black cursor-pointer ${
          currentPlayer === playerNo ? "" : "opacity-50"
        }`}
      >
        {currentPlayer === playerNo ? renderDiceDots(diceValue) : null}
      </div>
      <span className={`mt-2 text-sm font-bold`}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </span>
    </div>
  );
};

export default Dice;
