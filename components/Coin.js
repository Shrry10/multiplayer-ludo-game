const Coin = ({ coin, onMoveCoin, steps }) => {
  const handleClick = () => {
    onMoveCoin(coin.id, steps); // Call move coin when clicked
  };

  const colors = ["#7f1d1d", "#14532d", "#ca8a04", "#1e3a8a"];
  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full`}
      style={{ backgroundColor: colors[coin.player - 1] }}
      onClick={handleClick}
    >
      <span className="text-white font-bold"></span>{" "}
      {/* Coin representation */}
    </div>
  );
};

export default Coin;
