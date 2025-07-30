import { useEffect, useState } from 'react';
import Cell from "./Cell";
import Confetti from "react-confetti";
import { MdOutlineTransferWithinAStation } from 'react-icons/md';

export default function MultiPlayer({ setMode }) {
    const [cells, setCells] = useState(["", "", "", "", "", "", "", "", ""]);
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [winner, setWinner] = useState(null);
    const winConditions = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState(null);
    const [history, setHistory] = useState([]);
    const [winningLine, setWinningLine] = useState(null);

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
          <Cell key={ index } value={ cell } onClick={ () => click(index) } isWinningCell={ isWinningCell } />
        )
    })

    function click(id){
      setHistory(prevHistory => [...prevHistory, cells])
      if(cells[id] === "" && !gameOver){
          setCells(prevCells => {
              const newCells = [...prevCells];
              newCells[id] = currentPlayer;
              return newCells;
          });
          setCurrentPlayer(prev => prev === "X" ? "O" : "X");
      }
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

            const prevCells = history[history.length - 1];
            setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 1));
            setCells(prevCells);
            setCurrentPlayer(prev => prev === "X" ? "O" : "X");

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
    }

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

    useEffect(() => {
        checkPlayerWon();

        if(cells.every(cell => cell !== "") && !winner){
            setGameOver(true);
            setMessage(`It's a tie`);
        }

        if(winner){
            setMessage(`Player ${winner} wins!`)
        }
    }, [cells, winner])

    return (
        <>
            { winner && <Confetti /> }
            <h2>Multi Player</h2>
            <section className="grid-container">
                <div className="grid">
                    { grid }
                </div>
                { winner && winningLine ? (<div className={ `winning-line ${ getLineType(winningLine)}`} style={ getLineStyle() }></div>) : null}
            </section>
            <h2>{ !gameOver ? `player ${currentPlayer}'s turn ` : message }</h2>
            <div className="controls">
                <button className="control" onClick={ () => setMode("neutral") }>Change Mode</button>
                <button onClick={ restart } className="control restart">Restart</button>
                <button onClick={ undo } className={ `control ${history.length < 2 || winner ? "disabled" : "undo" }`} disabled={history.length < 2 || winner}>Undo</button>
            </div>
        </>
    )
}


