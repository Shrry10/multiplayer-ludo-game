const Dice = ({ player_id, color, is_active, rollDice, value }) => {
    return (
      <div className={`flex flex-col items-center justify-center ${is_active ? 'opacity-100' : 'opacity-50'}`}>
        <div
          className={`w-12 h-12 bg-${color}-500 text-white font-bold flex items-center justify-center rounded-full cursor-pointer`}
          onClick={is_active ? rollDice : null}
        >
          {value || 'Roll'}
        </div>
        <div className="text-sm mt-2">Player {player_id}</div>
      </div>
    );
  };
  
  export default Dice;
  