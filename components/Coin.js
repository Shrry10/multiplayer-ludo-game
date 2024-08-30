const Coin = ({ coin, moveCoin }) => {
    if (!coin.player_id) return null; // No coin if player_id is null
  
    const colors = ['green', 'yellow', 'red', 'blue']; // Player colors
  
    return (
      <div
        className={`w-8 h-8 rounded-full bg-${colors[coin.player_id - 1]}-500 m-1 flex items-center justify-center cursor-pointer`}
        onClick={moveCoin}
      >
        <span className="text-white text-xs font-bold">{coin.player_id}</span>
      </div>
    );
  };
  
  export default Coin;
  