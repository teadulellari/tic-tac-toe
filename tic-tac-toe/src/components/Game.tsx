import { useState } from "react";
import Square from "./Square";

const initialGameState = ["X", "", "", "", "", "", "", "", ""];

const Game = () => {
  const [gameState, setGameState] = useState(initialGameState);
  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-center text-5xl mb-4 font-display text-white">
        Tic Tac Toe Game
      </h1>
      <div>
        <div className="grid grid-cols-3 gap-3 mx-auto w-96">
          {gameState.map((player, index) => (
            <Square key={index} {...{player}} />
          ))}
        </div>
        <div>Scores Go Here</div>
      </div>
    </div>
  );
};

export default Game;
