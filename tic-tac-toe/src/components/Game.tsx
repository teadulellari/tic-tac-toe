import { useState, useEffect, MouseEventHandler } from "react";
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
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  useEffect(() => {
    if (gameState === initialGameState) {
      return;
    }
    checkIfOver();
    changePlayer();
    if (checkForWinner(gameState)) {
      setCurrentPlayer("X");
    }
  }, [gameState]);

  useEffect(() => {
    if (currentPlayer === "O") {
      let result = checkForWinner(gameState);
      if (result !== "tie") {
        let aiCoordinates = bestMove();
        const newValues = [...gameState];
        newValues[aiCoordinates] = currentPlayer;
        if (currentPlayer === "O" && aiCoordinates != null) {
          setGameState(newValues);
        }
      }
    }
  }, [currentPlayer]); 

  const resetBoard = () => setGameState(initialGameState);

  const handleWin = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);
    const newScores = { ...scores, [currentPlayer]: scores[currentPlayer] + 1 };
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    resetBoard();
  };

  const handleDraw = () => {
    window.alert("The game ended in a draw.");
    resetBoard();
  };

  const checkIfOver = () => {
    const winner = checkForWinner(gameState);

    if (winner === "tie") {
      setTimeout(() => handleDraw(), 500);
    } else if (winner) {
      setTimeout(() => handleWin(), 500);
    }
  };

  const equals3 = (a: string, b: string, c: string): boolean =>
    a === b && b === c && a !== "";

  const checkForWinner = (gameState: string[]): string | null => {
    let winner: string | null = null;

    // Horizontal
    for (let i = 0; i < 3; i++) {
      if (
        equals3(gameState[i * 3], gameState[i * 3 + 1], gameState[i * 3 + 2])
      ) {
        winner = gameState[i * 3];
      }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(gameState[i], gameState[i + 3], gameState[i + 6])) {
        winner = gameState[i];
      }
    }

    // Diagonal
    if (equals3(gameState[0], gameState[4], gameState[8])) {
      winner = gameState[0];
    }
    if (equals3(gameState[2], gameState[4], gameState[6])) {
      winner = gameState[2];
    }

    let openSpots = 0;
    for (let i = 0; i < 9; i++) {
      if (gameState[i] === "") {
        openSpots++;
      }
    }

    return winner === null && openSpots === 0 ? "tie" : winner;
  };

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const bestMove = () => {
    let bestScore = -Infinity;
    let coordinates: any;

    for (let i = 0; i < 9; i++) {
      if (gameState[i] === "") {
        let newGameState = [...gameState];
        newGameState[i] = currentPlayer;
        let score = 0;
        score = minimax(newGameState, 0, false);
        newGameState[i] = "";
        if (score > bestScore) {
          bestScore = score;
          coordinates = i;
        }
      }
    }

    return coordinates;
  };
  let scoresample: any = {
    X: -10,
    O: 10,
    tie: 0,
  };

  const minimax = (
    gameState: Array<string>,
    depth: number,
    isMaximizer: boolean
  ): number => {
    let result = checkForWinner(gameState);
    if (result != null) {
      let score = scoresample[result];
      return score;
    }
    if (isMaximizer) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameState[i] === "") {
          const newGameState = [...gameState];
          newGameState[i] = "O";
          let score = minimax(newGameState, depth + 1, false);
          newGameState[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      // MINIMIZER
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameState[i] === "") {
          const newGameState = [...gameState];
          newGameState[i] = "X";
          let score = minimax(newGameState, depth + 1, true);
          newGameState[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
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
          <div className="text-2xl text-serif text-white font-bold mr-8">
            <p className="mt-5">
              Next Player: <span>{currentPlayer}</span>
            </p>
            <p className="mt-5">
              Player X wins: <span>{scores["X"]}</span>
            </p>
            <p className="mt-5">
              Player O wins: <span>{scores["O"]}</span>
            </p>
          </div>
          <button
            className={`bg-white hover:bg-gray-100 text-teal-500 font-semibold  py-3 px-6 text-serif rounded shadow ${hoverStyle}`}
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
