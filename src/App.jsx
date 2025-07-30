import { useEffect, useState } from 'react';
import Multiplayer from "./components/MultiPlayer";
import SinglePlayer from "./components/SinglePlayer";
import { FaUsers, FaRobot } from "react-icons/fa";
import './App.css'

function App() {
    const [mode, setMode] = useState("neutral");
    const [view, setView] = useState(null);
    // console.log(mode);

    useEffect(() => {
        const select = () => {
        if (mode === "neutral"){
            return(<>
                <div className="logo"></div>
                <div className="mode-selection">
                    <button onClick={ () => setMode("single-player") }><FaRobot /> Single Player</button>
                    <button onClick={ () => setMode("multi-player") }><FaUsers /> Multi player</button>
                </div>
            </>)
        }else if(mode === "single-player"){
            return <SinglePlayer setMode={ setMode }/>
        }else{
            return <Multiplayer setMode={ setMode }/>
        }
    };
    setView(select);
    console.log(mode, "mode");
    }, [mode])


    return (
      <main className="game-board">
          <h1>TIC TAC TOE</h1>
          { view }
      </main>
    )
}

export default App
