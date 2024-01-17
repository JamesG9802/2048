import { GameInfo, get_valid_moves, initialize, is_lost, make_move } from "./GameLogic.tsx";

import fs from "fs";

//  https://stackoverflow.com/a/58689284
//  Using node.js to run experiments

/**
 * Simulates a number of games of 2048 played randomly.
 * @param num_games 
 */
function random_move_game_analysis(num_games: number) {
    let file_content: string = "";
    for(let game = 0; game < num_games; game++) {
        let game_info: GameInfo = initialize();
        
        //  Play random moves
        while(!is_lost(game_info)) {
            const valid_moves: number[] = get_valid_moves(game_info);
            const chosen_move: number = valid_moves[Math.floor(Math.random() * valid_moves.length)];

            game_info = make_move(game_info, chosen_move);
        }
        file_content += game_info.moves_made + "\n";
    }
    console.log(file_content.substring(0, 256));
    fs.writeFile('./random.csv', file_content, err => {
        if(err) {
            console.error(err);
        }
    });
}


random_move_game_analysis(100000);