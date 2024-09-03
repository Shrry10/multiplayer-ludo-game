const Coin = ({ coin, onMoveCoin, steps }) => {
  const handleClick = () => {
    onMoveCoin(coin.id, steps); // Call move coin when clicked
  };

  const colors = ["red", "green", "yellow", "blue"];
  return (
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full`}
      style={{ backgroundColor: colors[coin.player - 1] }}
      onClick={handleClick}
    >
      <span className="text-white font-bold">C</span>{" "}
      {/* Coin representation */}
    </div>
  );
};

export default Coin;
