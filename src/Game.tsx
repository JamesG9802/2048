import { useState } from "react";
import { GameInfo, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, get_movable_tiles, get_valid_moves, initialize, is_lost, make_move } from "./scripts/GameLogic";
import './tile_animation.css'


export interface MovingTile {
    index: number,
    direction: number,
    length: number
}


//  Styling based off Gabriele Cirulli's 2048 at https://play2048.co/
export function GameContainer(): JSX.Element {
    const [num_moves_made, set_num_moves_made] = useState(0);
    const [game_info, set_game_info] = useState(initialize());
    const [moving_tiles, set_moving_tiles] = useState([] as MovingTile[]);

    function animated_make_move(game_info: GameInfo, direction: number) {
        set_num_moves_made(num_moves_made + 1);
        //  chooses affected tiles to visually move
        set_moving_tiles(get_movable_tiles(game_info, direction));
        //  actually sets the board to after the move
        setTimeout(()=>{
            set_game_info(make_move(game_info, direction));
            set_moving_tiles([]);
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
            <p className="text-2xl font-bold p-5">Number of moves made: {num_moves_made}</p>

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
                console.log(get_valid_moves(game_info));
            }}>Play Random Moves</button>
            <button className="no-select" onClick={()=>{
                set_game_info(initialize());
                set_num_moves_made(0);
            }}>Reset</button>
        </>
    );
}
