import { useState } from "react";
import { add_random_tile, initialize, is_lost } from "./scripts/GameLogic";

//  Styling based off Gabriele Cirulli's 2048 at https://play2048.co/
export function GameContainer(): JSX.Element {
    const [game_info, set_game_info] = useState(initialize());

    function RunSolver(): JSX.Element {
        return <>
            <button onClick={()=>{
                set_game_info(add_random_tile(game_info));
                console.log(is_lost(game_info));
            }}>Run Solver</button>
        </>;
    }

    let board = game_info.board.map((cell, index) => {
        let cell_class: number = cell;

        //  For the purposes of styling, values > 4096 have the same styling as 4096.
        if(cell >= 4096) {
            cell_class = 4096;
        }

        //  If 0, then treat it as an empty space and don't show any number.
        if(cell == 0) {
            return <div key={index} className="grid-cell"></div>
        }
        //  Otherwise, show a number
        return <div key={index} className={`grid-cell tile-${cell_class}`}>{cell}</div>
    });

    return (
        <>
            <div className="game no-select">
                <div className="game-grid grid grid-cols-4 gap-3 content-center">
                    {board}
                </div>
            </div>
            <RunSolver/>
        </>
    );
}
