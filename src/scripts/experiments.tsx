import { minimax, random_move } from "./AntiSolver.tsx";
import { GameInfo, initialize, is_lost, make_move_and_add_tile } from "./GameLogic.tsx";

import fs from "fs";

//  https://stackoverflow.com/a/58689284
//  Using node.js to run experiments

interface Data {
    /**
     * An array of the total number of moves made for each game.
     */
    moves_made: number[]
}

function write_data_to_file(data: Data, file_path: string) {
    let file_content: string = "";
    for(let i = 0; i < data.moves_made.length; i++) {
        file_content += data.moves_made[i] + "\n";
    }
    fs.writeFile(file_path, file_content, err => {
        if(err) {
            console.error(err);
        }
    });
}

/**
 * Simulates a number of games of 2048 played randomly.
 * @param num_games 
 */
function random_move_game_analysis(num_games: number) {
    let data: Data = {moves_made: []};

    for(let game = 0; game < num_games; game++) {
        let game_info: GameInfo = initialize();
        
        //  Play random moves
        while(!is_lost(game_info)) {
            const chosen_move: number = random_move(game_info);
            game_info = make_move_and_add_tile(game_info, chosen_move);
        }
        data.moves_made.push(game_info.moves_made);
    }
    write_data_to_file(data, './random.csv');
}

/**
 * Simulates a number of games of 2048 with the minmax algorithm.
 * Because 2048 is not a two-player game, we treat the maximizer as the agent inputting directions
 * and the minimizer as the agent randomly placing a 2 or 4 in an empty tile.
 * @param num_games 
 * @param max_depth the maximum depth that will be searched
 */
function minimax_game_analysis(num_games: number, max_depth: number) {
    let data: Data = {moves_made: []};
    const start: number = performance.now();
    for(let game = 0; game < num_games; game++) {
        let game_info: GameInfo = initialize();
        
        //  Play the best move chosen by the minimax algorithm
        if(game % 100 == 0) console.log(game);
        
        while(!is_lost(game_info)) {
            let evaluation: [number, number] = minimax(game_info, max_depth, true, 0, Number.MIN_VALUE, Number.MAX_VALUE);
            game_info = make_move_and_add_tile(game_info, evaluation[1]);
        }
        data.moves_made.push(game_info.moves_made);
    }
    const end: number = performance.now();
    console.log(`Time to complete ${num_games} games with max depth of ${max_depth}: ${end - start} milliseconds.`);
    write_data_to_file(data, './minimax.csv');
}

/**
 * Uses a gradient descent search to find the locally optimal parameters for minimax.
 * @param num_games 
 * @param max_depth 
 * @param max_generations 
 * @returns an array of numbers representing the weights and bias of the minimax algorithm.
 */
function tune_minimax_parameters(num_games: number, max_depth: number, max_generations: number): number[] {
    return [];
}

// random_move_game_analysis(100000);
minimax_game_analysis(1000, 5);