import { useEffect, useState } from 'react';
import Cell from "./Cell";
import { FaUsers, FaRobot } from "react-icons/fa";
import Confetti from "react-confetti";

export default function SinglePlayer({ setMode }) {
    const [cells, setCells] = useState(["", "", "", "", "", "", "", "", ""]);
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [winner, setWinner] = useState(null);
    const winConditions = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState(null);
    const [history, setHistory] = useState([]);
    const [winningLine, setWinningLine] = useState(null);
    const humanPlayer = "X";
    const aiPlayer = "O";

    const getLineType = (line) => {
        if (line[0] + 1 === line[1] && line[1] + 1 === line[2]) return 'horizontal';
        if (line[0] + 3 === line[1] && line[1] + 3 === line[2]) return 'vertical';
        if (line[0] === 0 && line[1] === 4 && line[2] === 8) return 'diagonal-1';
        if (line[0] === 2 && line[1] === 4 && line[2] === 6) return 'diagonal-2';
        return '';
    };

    const grid = cells.map((cell, index) => {
        const isWinningCell = winner && winningLine && winningLine.includes(index);
        return(
          <Cell key={ index } value={ cell } onClick={ () => click(index) } isWinningCell={ isWinningCell }/>
        )
    })

    function click(id){
      setHistory(prevHistory => [...prevHistory, cells])
      if(currentPlayer === humanPlayer && cells[id] === "" && !gameOver){
          setCells(prevCells => {
              const newCells = [...prevCells];
              newCells[id] = currentPlayer;
              return newCells;
          });
          setCurrentPlayer(prev => prev === "X" ? "O" : "X");
      }
    }

    function randomNumber(array){
        return array[Math.floor(Math.random() * array.length)];
    }

    function checkPotentialWinner(currentCells, player){
        for(let i = 0; i < winConditions.length; i++){
            const [a, b, c] = winConditions[i];
            if(currentCells[a] === player && currentCells[b] === player && currentCells[c] === player){
                return true;
            }
        }
        return false;
    };

    function getAiMove(currentCells, aiPlayer, humanPlayer){
        const emptySquares = currentCells.map((square, index) => square == "" ? index : null).filter(index => index !== null);

        if(!emptySquares){
            return -1;  //no empty squares means no moves left
        }

        ///checking for winning move
        for (let i = 0; i < emptySquares.length; i++){
            const tempCells = [...currentCells];
            tempCells[emptySquares[i]] = aiPlayer;
            // console.log(checkPotentialWinner(tempCells, aiPlayer));
            if(checkPotentialWinner(tempCells, aiPlayer)){
                console.log("ai: winning move");
                return emptySquares[i];
            }
        }

        //checking for blocking move
        for (let i = 0; i < emptySquares.length; i++){
            const tempCells = [...currentCells];
            tempCells[emptySquares[i]] = humanPlayer;
            if(checkPotentialWinner(tempCells, humanPlayer)){
                console.log("ai: blocking move");
                return emptySquares[i];
            };
        }

        //take the center if available
        if(emptySquares.includes(4)) { console.log("ai: taking center"); return 4; }

        //block a double win chance creation manuever by forcing opponent to block
        const midBlocks = [1, 3, 5, 7];
        const manuever = currentCells[0] === humanPlayer && currentCells[8] === humanPlayer || currentCells[2] === humanPlayer && currentCells[6] === humanPlayer;
        const availableMidBlocks = midBlocks.filter(block => emptySquares.includes(block));
        if(manuever && availableMidBlocks.length > 0){
            const play = randomNumber(availableMidBlocks);
            console.log("ai: blocking double win chance creation");
            return play;
        }

        //take a random corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => emptySquares.includes(corner));
        if(availableCorners.length > 0) {
            const play = randomNumber(availableCorners);
            console.log("ai: taking corner", play);
            return play;
        }

        ///finally pick a random square
        if(emptySquares.length > 0) { console.log("ai: mhmhmh..."); return randomNumber(emptySquares); }

        return -1; //should never be reached
    }

    function checkPlayerWon(){
        winConditions.map(condition => {
            const [a, b, c] = condition;

            if(cells[a] !== "" && cells[a] === cells[b] && cells[b] === cells[c]){
                setWinner(cells[a]);
                setGameOver(true);
                setWinningLine(condition);
            };
        })
    };

    function undo(){
        if(history.length > 1 && !winner){

            if(currentPlayer === humanPlayer){
                const prevCells = history[history.length - 2];
                setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 2));
                setCells(prevCells);
            } else {
                const prevCells = history[history.length - 3];
                setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 3));
                setCells(prevCells);
                setCurrentPlayer(prev => prev === "X" ? "O" : "X");
            }

            // setCurrentPlayer(prev => prev === "X" ? "O" : "X");

            // If game was over (but not due to winner), reset gameOver and message
            if (gameOver && !winner) {
                setGameOver(false);
                setMessage(null);
            }

        }
    }

    function restart(){
        setCells(["", "", "", "", "", "", "", "", ""]);
        setGameOver(false);
        setWinner(null);
        setCurrentPlayer("X");
        setHistory([]);
        setMessage(null);
    }

    useEffect(() => {
        checkPlayerWon();
        const isBoardFull = cells.every(cell => cell !== "");

        if(isBoardFull && !winner){
            setGameOver(true);
            setMessage(`It's a tie`);
        }

        if(winner){
            setMessage(`Player ${winner} wins!`);
            setGameOver(true);
        }

        //AI's turn logic
        if(currentPlayer === aiPlayer && !gameOver && !winner && !isBoardFull){
            const aiMoveDelay = setTimeout(() => {
                const aiMoveIndex = getAiMove(cells, aiPlayer, humanPlayer);
                // console.log(aiMoveIndex);
                if(aiMoveIndex !== -1){
                    setHistory(prevHistory => [...prevHistory, cells]);
                    setCells(prevCells => {
                        const newCells = [...prevCells];
                        newCells[aiMoveIndex] = aiPlayer;
                        return newCells;
                    });
                    setCurrentPlayer(humanPlayer);
                }
            }, 500)

            return () => clearTimeout(aiMoveDelay);
        }

    }, [cells, winner, currentPlayer, gameOver]);

    const getLineStyle = () => {
        if (!winningLine) return {}; // No line to show

        const lineType = getLineType(winningLine);
        switch (lineType) {
            case 'horizontal':
                if (winningLine[0] === 0) return { top: '16.6%', left: '0', transform: 'none' }; // Top row
                if (winningLine[0] === 3) return { top: '50%', left: '0', transform: 'none' };   // Middle row
                if (winningLine[0] === 6) return { top: '83.3%', left: '0', transform: 'none' }; // Bottom row
                break;
            case 'vertical':
                if (winningLine[0] === 0) return { left: '16.6%', top: '0', transform: 'none' }; // Left col
                if (winningLine[0] === 1) return { left: '50%', top: '0', transform: 'none' };   // Middle col
                if (winningLine[0] === 2) return { left: '83.3%', top: '0', transform: 'none' }; // Right col
                break;
            case 'diagonal-1': // 0, 4, 8 (top-left to bottom-right)
                return { top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: '120%' };
            case 'diagonal-2': // 2, 4, 6 (top-right to bottom-left)
                return { top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', width: '120%' };
            default:
                return {};
        }
        return {};
    };

    return (
        <>
            { winner && <Confetti /> }
            {/* <h1>Single Player</h1> */}
            <section className="grid-container">
                <div className="grid">
                    { grid }
                </div>
                { winner && winningLine ? (<div className={ `winning-line ${ getLineType(winningLine)}`} style={ getLineStyle() }></div>) : null}
            </section>
            <div className="message">
                { !message
                    ? (
                        currentPlayer == aiPlayer
                            ? <FaRobot size={35} />
                            : <FaUsers size={35} />)
                    : (
                        winner == humanPlayer
                            ? <FaUsers size={35} />
                            : <FaRobot size={35} /> )
                }
                <h2>{ !gameOver ? `player ${ currentPlayer }'s turn ` : message }</h2>
            </div>
            <div className="controls">
                <button className="control" onClick={ () => setMode("neutral") }>Change Mode</button>
                <button onClick={ restart } className="control restart">Restart</button>
                {/* Disable undo button if no history or if a winner has been declared */}
                <button onClick={ undo } className={ `control ${history.length < 2 || winner ? "disabled" : "undo" }`} disabled={history.length < 2 || winner}>Undo</button>
            </div>
        </>
    )
}


