import Game from "../../components/Game";

const Ludo = ({ gameId }) => {
  return (
    <div>
      <Game gameid={gameId} />
    </div>
  );
};

// `getServerSideProps` to fetch gameId from the URL
export async function getServerSideProps(context) {
  const { gameId } = context.params;

  // Return gameId as props to the component
  return {
    props: {
      gameId,
    },
  };
}

export default Ludo;
