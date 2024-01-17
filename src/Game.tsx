import { useEffect, useRef, useState } from "react";
import { GameInfo, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, get_movable_tiles, get_valid_moves, initialize, is_lost, make_move } from "./scripts/GameLogic";
import './tile_animation.css'


export interface MovingTile {
    index: number,
    direction: number,
    length: number
}


//  Styling based off Gabriele Cirulli's 2048 at https://play2048.co/
export function GameContainer(): JSX.Element {
    const [game_info, set_game_info] = useState(initialize());
    const [moving_tiles, set_moving_tiles] = useState([] as MovingTile[]);
    const running = useRef(false);
    const should_reset = useRef(false);

    function animated_make_move(game_info: GameInfo, direction: number, 
        callback?: (c_game_info: GameInfo) => void) {
        if(game_info.locked) return;
        game_info.locked = true;
        //  chooses affected tiles to visually move
        set_moving_tiles(get_movable_tiles(game_info, direction));
        //  actually sets the board to after the move
        setTimeout(()=>{
            let new_game_info: GameInfo = make_move(game_info, direction);
            new_game_info.locked = false; 
            set_game_info(new_game_info);
            set_moving_tiles([]);
            if(callback != undefined) {
                callback(new_game_info);
            }
        }, 90);
    } 

    let board = game_info.board.map((cell, index) => {
        let cell_class: number = cell;
        let moving_class: string = "";
        let new_class: string = "";

        //  For the purposes of styling, values > 4096 have the same styling as 4096.
        if(cell >= 4096) {
            cell_class = 4096;
        }

        //  also, add a movement class to show animated sliding
        for(let i = 0; i < moving_tiles.length; i++) {
            if(index == moving_tiles[i].index) {
                moving_class = "move-"
                switch(moving_tiles[i].direction) {
                    case MOVE_UP: moving_class += "up"; break;
                    case MOVE_RIGHT: moving_class += "right"; break;
                    case MOVE_DOWN: moving_class += "down"; break;
                    case MOVE_LEFT: moving_class += "left"; break;
                }
                moving_class += moving_tiles[i].length;
                break;
            }
        }
        
        //  If new, add the new tile class for animated pop in
        if(index == game_info.new_tile) {
            new_class = "tile-new";
        }

        //  If 0, then treat it as an empty space and don't show any number.
        if(cell == 0) {
            return <div key={index} className="grid-cell"></div>
        }
        //  Otherwise, show a number
        return <div key={index} className={
            `grid-cell tile-${cell_class} ${moving_class} ${new_class}`
        }>{cell}</div>
    });

    return (
        <>
            <p className="text-2xl font-bold p-5">Number of moves made: {game_info.moves_made}</p>

            <div tabIndex={0} onKeyDown={(e)=>{
                if(e.key == 'w') {
                    animated_make_move(game_info, MOVE_UP);
                }
                if(e.key == 'a') {
                    animated_make_move(game_info, MOVE_LEFT);
                }
                if(e.key == 's') {
                    animated_make_move(game_info, MOVE_DOWN);
                }
                if(e.key == 'd') {
                    animated_make_move(game_info, MOVE_RIGHT);
                }
            }}className="game no-select">
                <div className="game-grid grid grid-cols-4 gap-3 content-center">
                    {board}
                </div>
            </div>
            
            <button className="no-select" onClick={()=>{
                function random_move(game_info: GameInfo){
                    const valid_moves: number[] = get_valid_moves(game_info);
                    if(!is_lost(game_info) && running.current)
                    {
                        animated_make_move(game_info, 
                            valid_moves[Math.floor(Math.random() * valid_moves.length)],
                            random_move);
                    }
                    else {
                        running.current = false;
                        if(should_reset.current)
                            set_game_info(initialize());
                        should_reset.current = false;
                    }
                }
                if(running.current)
                {
                    running.current = false;
                }
                else {
                    running.current = true;
                    random_move(game_info);
                }
                
            }}>{!running.current ? 'Play Random Moves' : 'Stop'}</button>
            <button className="no-select" onClick={()=>{
                if(running.current)
                {
                    running.current = false;
                    should_reset.current = true;
                }
                set_game_info(initialize());
            }}>Reset</button>
        </>
    );
}
