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
//notes check the minimax. check why it doesnt stop when is won and check also why it doesnt stop the ganme
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
    console.log("CHANGING PLAYER")
    changePlayer()

  }, [gameState]);

  useEffect(() => {
    if (currentPlayer === "O") {
     let result= checkForWinner(gameState)
     if(result !== "tie"){
      let aiCoordinates = bestMove();
      console.log("AI move coord = "+ aiCoordinates)
      const newValues = [...gameState];
      newValues[aiCoordinates] = currentPlayer;
      console.log(" TURN IS = "+ currentPlayer)
      if(currentPlayer==="O" && aiCoordinates != null){
        setGameState(newValues);
      }
     }
    }
      
    //  }else{
    //   let huCordinates=bestMove();
    //   const newValues = [...gameState];
    //   newValues[huCordinates] = currentPlayer;
    //   setGameState(newValues);
      // }
  }, [currentPlayer]); //currentPLAYER

  const resetBoard = () => setGameState(initialGameState);

  const handleWin = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);
    // changePlayer();
    // const newPlayerScore = scores[currentPlayer] + 1;
    // const newScores = { ...scores };
    // newScores[currentPlayer] = newPlayerScore;
    // setScores(newScores);
    const newScores = {...scores, [currentPlayer]: scores[currentPlayer]+1 }
    setScores(newScores)
    localStorage.setItem("scores", JSON.stringify(newScores));
    resetBoard();
  };

  const handleDraw = () => {
    window.alert("The game ended in a draw.");
    resetBoard();
  };

  const checkIfOver = () => {
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
        setTimeout(() => handleWin(), 500);
        return;
      }
    }
   
    if (!gameState.includes("")) {
      setTimeout(() => handleDraw(), 500);
      return;
    }
    // changePlayer();
    //if player is ai (O) call the ai function
  };
  const equals3 = (a: string, b: string, c: string): boolean => a === b && b === c && a !== '';

const checkForWinner =(gameState: string[]) => {
  let winner: string | null = null;

  // Horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(gameState[i * 3], gameState[i * 3 + 1], gameState[i * 3 + 2])) {
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
    if (gameState[i] === '') {
      openSpots++;
    }
  }

  return winner === null && openSpots === 0 ? 'tie' : winner;
};

  // const evaluatingScores = (gameState: Array<string>) => {// HERE IS THE PROBLEMMMM
  //   for (let i = 0; i < winningCombos.length; i++) {
  //     const [a, b, c] = winningCombos[i];
  //     if (gameState[a] === gameState[b] && gameState[b] === gameState[c] && gameState[a] !== "") {
  //       return gameState[a] === "X" ? -10 : 10;
  //     }
  //   }
  
  //   if (!gameState.includes("")) {
  //     // It's a draw
  //     return 0;
  //   }
  
  // };
  // const isMoveLeft = () => {
  //   for (let i = 0; i < gameState.length; i++) {
  //     if (gameState[i] == "") return true;
  //   }

  //   return false;
  //  };
  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    console.log(currentPlayer);
  };

  const bestMove = () => {
    let bestScore = -Infinity;
    let coordinates: any;
  
    for (let i = 0; i < 9; i++) {
      // if(isMoveLeft()=== false){
      //   break;
      //  }
        if (gameState[i] === "") {
          let newGameState = [...gameState];
          newGameState[i] = currentPlayer;
          //
          let score = 0;
          // if (currentPlayer === "O") {
            score = minimax(newGameState, 0, false);
            console.log("OUR SCORE = "+ score)
          // } else {
          //   score = minimax(newGameState, 0, true);
          // }
          // gameState[i] = currentPlayer;//"O"
          // let score = minimax(newGameState, 0, false);
          newGameState[i] = "";
          // bestScore = Math.max(score, bestScore);
          if (score > bestScore) {
            console.log(score);
            bestScore = score;
            console.log(bestScore);
            coordinates = i;
            console.log(coordinates);
          }
        }
      
   
    }

    return coordinates;
  };
  let scoresample: any = {
    X:-10,
    O: 10,
    tie: 0,
  }

  // ai move
  const minimax = (gameState: Array<string>, depth: number, isMaximizer: boolean): number => {
   debugger
    // if (!isMoveLeft()) {
    //   return 0;
    // }
  //   const score = evaluatingScores(gameState);
  //   if (score === 10) {
  //     return 10;
  //   }
  //  if(score === -10){
  //   return -10;
  //  }
  let result = checkForWinner(gameState);
  if(result!=null){
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
      //   const score = evaluatingScores();
      //   if (score === 10) {
      //     return 10;
      //   }
      //  if(score === -10){
      //   return -10;
      //  }
      }
      return bestScore;
    } else { // MINIMIZER
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameState[i] === "") {
          const newGameState = [...gameState];
          newGameState[i] = "X";
          let score = minimax(newGameState, depth + 1, true);
          newGameState[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      //   const score = evaluatingScores();
      //   if (score === 10) {
      //     return 10;
      //   }
      //  if(score === -10){
      //   return -10;
      //  }
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
   
  
    // setCurrentPlayer("X"); // No need to set currentPlayer here
  };

  // const isMaximizer = () => {
  //   if(currentPlayer === "O"){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }
  //here is the minimax
  //the maximizer is ai and minimizer is human
  //depth is the empty places in the board
  // let determiningScore : {
  //   "X" : 1;
  //   "O" : -1;
  //   "tie" : 0;
  // }
  // const findDepth = (gameState: Array<string>): number => {
  //   //checkForWinner();
  //   let depth = 0;
  //   for (let i = 0; i < gameState.length; i++) {
  //     if (gameState[i] == "") {
  //       depth++;
  //     }
  //   }
  //   return depth;
  // };

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
