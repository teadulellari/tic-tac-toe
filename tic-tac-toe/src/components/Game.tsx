import { useState, useEffect } from "react";
import Square from "./Square";

type Scores = {
  [key: string]: number;
};

const initialGameState = ["", "", "", "", "", "", "", "", ""];
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const initialScores: Scores = { X: 0, O: 0 };

const Game = () => {
  const [gameState, setGameState] = useState(initialGameState);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState(initialScores);

  useEffect(() => {
    checkForWinner();
  }, [gameState]);

  const resetBoard = () => setGameState(initialGameState);

  const handleWIn = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);

    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = { ...scores };
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    resetBoard();
  };

  const handleDraw = () => {
    window.alert("The game ended in a draw.");
    resetBoard();
  };

  const checkForWinner = () => {
    let roundWon = false;

    for (let i = 0; i < winningCombos.length; i++) {
      const winCombo = winningCombos[i];
      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if ([a, b, c].includes("")) {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }
    if (roundWon) {
      setTimeout(() => handleWIn(), 500);
      return;
    }
    if (!gameState.includes("")) {
      setTimeout(() => handleDraw(), 500);
      return;
    }
    changePlayer();
  };

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleclick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));
    const currentValue = gameState[cellIndex];
    if (currentValue) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
    console.log(
      "file: Game.tsx ~ line 14 ~ handleClick ~ currentValue",
      currentValue
    );
  };
  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-center text-5xl mb-4 font-display text-white">
        Tic Tac Toe Game
      </h1>
      <div>
        <div className="grid grid-cols-3 gap-3 mx-auto w-96">
          {gameState.map((player, index) => (
            <Square key={index} onClick={handleclick} {...{ index, player }} />
          ))}
        </div>
        <div className="mx-auto w-96 text-2xl text-serif">
          <p className="text-white mt-5">
            Next Player: <span>{currentPlayer}</span>
          </p>
          <p className="text-white mt-5">
            Player X wins: <span>{scores["X"]}</span>
          </p>
          <p className="text-white mt-5">
            Player O wins: <span>{scores["O"]}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Game;
