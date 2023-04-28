import { useState, useEffect, MouseEventHandler} from "react";
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
   const hoverStyle = "transition duration-500 hover:scale-105 transform";
  const [gameState, setGameState] = useState(initialGameState);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState(initialScores);


  useEffect(() => {
    //getting the scores to local storage to avoid them dissapearing after page refreshes
    const storedScores = localStorage.getItem("scores");
    if(storedScores) {
      setScores(JSON.parse(storedScores));
    }
   
  }, []) ;

  useEffect(() => {
    if(gameState === initialGameState) {
      return;
    }
    checkForWinner();
  }, [gameState]);

  const resetBoard = () => setGameState(initialGameState);

  const handleWIn = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);

    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = { ...scores };
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores))
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

  const handleClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));
    const currentValue = gameState[cellIndex];
    if (currentValue) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);

  };

  const handleRestart: MouseEventHandler<HTMLButtonElement> = () => {
    setGameState(initialGameState);
    setScores(initialScores);
  };

  return (
<div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
  <h1 className="text-center text-5xl mb-4 font-display text-white">
    Tic Tac Toe Game
  </h1>
  <div>
    <div className="grid grid-cols-3 gap-3 mx-auto w-96">
      {gameState.map((player, index) => (
        <Square key={index} onClick={handleClick} {...{ index, player }} />
      ))}
    </div>
    <div className="flex items-center justify-center mx-auto w-96">
      <div className="text-2xl text-serif text-white mr-8">
        <p>
          Next Player: <span>{currentPlayer}</span>
        </p>
        <p className="mt-5">
          Player X wins: <span>{scores["X"]}</span>
        </p>
        <p className="mt-5">
          Player O wins: <span>{scores["O"]}</span>
        </p>
      </div>
      <button className={`bg-white hover:bg-gray-100 text-teal-500 font-semibold  py-3 px-6 text-serif rounded shadow ${hoverStyle}`} onClick={handleRestart}>
        Restart
      </button>
    </div>
  </div>
</div>
  );
};

export default Game;
