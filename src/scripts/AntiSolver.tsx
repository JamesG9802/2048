import { GameInfo, clone, get_available_tiles, get_valid_moves, is_lost, make_move, set_random_tile } from "./GameLogic";

/**
 * Returns a random valid move for a game.
 * @param game_info 
 */
export function random_move(game_info: GameInfo): number {
    const valid_moves: number[] = get_valid_moves(game_info);
    return valid_moves[Math.floor(Math.random() * valid_moves.length)];
}

/**
 * Evaluation algorithm that returns high values for positions that are closer to ending the game.
 * @param game_info 
 * @returns 
 */
function minimax_evaluation(game_info: GameInfo): number {
    if(is_lost(game_info)) {
        return Number.MAX_VALUE;
    }

    //  A good move is one that
    //  1 (reduces the number of empty tiles)
    //  2 (reduces the number of tiles with the same value that are adjacent to each other)
    let evaluation: number = 0;
    let weight_1: number = 16;
    let weight_2: number = 1;
    
    //  1
    //  The maximum number of empty tiles is 15 (there is no way to have a completely empty board).
    evaluation += weight_1 * (15 - get_available_tiles(game_info).length)

    //  2
    let number_same_adjacent: number = 0;
    for(let i = 0; i < game_info.board.length; i++) {
        let up_neighbor = i - 4;
        let down_neighbor = i + 4;
        let left_neighbor = i - 1;
        let right_neighbor = i + 1;
        
        //  bounds check; because i is always within [0, length -1], 
        //  it is safe to leave the neighbors out of bounds when comparing
        if(up_neighbor >= 0)
            up_neighbor = game_info.board[up_neighbor];
        else 
            up_neighbor = -1;
        if(down_neighbor < game_info.board.length)
            down_neighbor = game_info.board[down_neighbor];
        else
            down_neighbor = -1;
        if(left_neighbor >= 0 && Math.floor(left_neighbor / 4) == Math.floor(i / 4)) 
            left_neighbor = game_info.board[left_neighbor];
        else 
            left_neighbor = -1;
        if(right_neighbor < game_info.board.length && Math.floor(right_neighbor / 4) == Math.floor(i / 4)) 
            right_neighbor = game_info.board[right_neighbor];
        else 
            right_neighbor = -1;
        
        const value = game_info.board[i];
        if(value == up_neighbor) number_same_adjacent++;
        if(value == down_neighbor) number_same_adjacent++;
        if(value == left_neighbor) number_same_adjacent++;
        if(value == right_neighbor) number_same_adjacent++;
    }
    evaluation += weight_2 * -number_same_adjacent;
    return evaluation;
}

/**
 * Runs the minmax algorithm for 2048.
 * Implementation based on https://www.youtube.com/watch?v=l-hh51ncgDI.
 * @param current_game
 * @param depth 
 * @param is_maximizer 
 * @param move the move chosen by the maximizer
 * @returns the evaluation score and the corresponding move that should be played.
 */
export function minimax(current_game: GameInfo, depth: number, is_maximizer: boolean, move: number): [number, number] {
    if(depth == 0 || is_lost(current_game))
        return [minimax_evaluation(current_game), move];
    if(is_maximizer) {
        const valid_moves: number[] = get_valid_moves(current_game);
        let max_evaluation: number = Number.MIN_VALUE;
        let max_move: number = valid_moves[0];

        //  The maximizer is the agent inputing the directional moves
        for(let i = 0; i < valid_moves.length; i++) {
            let after_move_game: GameInfo = clone(current_game);
            after_move_game = make_move(after_move_game, valid_moves[i])[0];
            
            //  When minimax is invoked, move is by default 0
            let evaluation: [number, number];
            if(move == 0)
                evaluation = minimax(after_move_game, depth - 1, false, valid_moves[i]);
            else
                evaluation = minimax(after_move_game, depth - 1, false, move);

            if(evaluation[0] > max_evaluation)
            {
                max_evaluation = evaluation[0];
                max_move = evaluation[1];   
            }
        }
        return [max_evaluation, max_move];
    }
    else {
        let min_evaluation: number = Number.MAX_VALUE;
        let min_move: number = move;

        //  The minimizer is the agent placing a random 2 or 4 tile in an empty space.
        let empty_tiles_indices: number[] = get_available_tiles(current_game);
        for(let i = 0; i < empty_tiles_indices.length; i++) {
            let after_move_game_2: GameInfo = clone(current_game);
            let after_move_game_4: GameInfo = clone(current_game);

            after_move_game_2 = set_random_tile(after_move_game_2, 2, empty_tiles_indices[i]);
            after_move_game_4 = set_random_tile(after_move_game_4, 4, empty_tiles_indices[i]);

            let evaluation_2 = minimax(after_move_game_2, depth - 1, true, move);
            let evaluation_4 = minimax(after_move_game_4, depth - 1, true, move);

            if(evaluation_2[0] < min_evaluation) {
                min_evaluation = evaluation_2[0];
                min_move = evaluation_2[1];
            }
            else if (evaluation_4[0] < min_evaluation) {
                min_evaluation = evaluation_4[0];
                min_move = evaluation_4[1];
            }
        }
        return [min_evaluation, min_move];
    }
}

/**
 * Returns a valid move chosen by a minmax search
 * @param game_info 
 */
export function minimax_move(game_info: GameInfo, max_depth?: number): number {
    return minimax(game_info, max_depth != undefined ? max_depth : 5, true, 0)[1];
}