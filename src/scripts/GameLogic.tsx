import { MovingTile } from "../Game";

export const MOVE_UP = -4;
export const MOVE_RIGHT = 1;
export const MOVE_DOWN = 4;
export const MOVE_LEFT = -1;

/**
 * An interface containing the state of a 2048 game.
 */
export interface GameInfo {
    /**
     * A 1D array representing each tile of a 2048 game.
     */
    board: number[],
    new_tile: number,
};

/**
 * Initialize the game with two random starting tiles.
 */
export function initialize(): GameInfo {
    let new_board: number[] = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]
    let game_info: GameInfo = {
        board: new_board,
        new_tile: -1
    }
    
    //  Add two starting tiles
    for(let i = 0; i < 2; i++) {
        game_info = add_random_tile(game_info);
    }
    return game_info;
}

/**
 * Clones a game info object.
 * @param game_info 
 */
export function clone(game_info: GameInfo): GameInfo {
    return {
        board: [...game_info.board],
        new_tile: game_info.new_tile
    }
}

/**
 * Returns a list of available tile indices. An empty array is returned if no tiles are available.
 */
export function get_available_tiles(game_info: GameInfo): number[]  {
    let available_tiles: number[] = [];
    for(let i = 0; i < game_info.board.length; i++) {
        if(game_info.board[i] == 0) {
            available_tiles.push(i);
        }
    }
    return available_tiles;
}

/**
 * Returns the index of an available tile, if it exists. Returns -1 if no index exists.
 */
export function get_random_available_tile(game_info: GameInfo): number {
    let available_tiles: number[] = get_available_tiles(game_info);

    if(available_tiles.length == 0) {
        return -1;
    }
    return available_tiles[Math.floor(Math.random() * available_tiles.length)]; 
}

/**
 * Returns a new game_info which added a random tile (90% are 2 and 10% are 4).
 * Based on https://github.com/gabrielecirulli/2048/blob/master/js/game_manager.js.
 * @param game_info the game info
 */
export function add_random_tile(game_info: GameInfo): GameInfo {
    if(get_available_tiles(game_info).length != 0) {
        let cell_value: number = Math.random() < 0.9 ? 2 : 4;
        let cell_index: number = get_random_available_tile(game_info);
        game_info.board[cell_index] = cell_value;
        game_info.new_tile = cell_index;
    }
    else {
        console.error("Can't add a random tile.");
    }
    return clone(game_info);
}

/**
 * Returns true if the game has no more valid moves to make.
 * @param game_info 
 */
export function is_lost(game_info: GameInfo): boolean {
    //  If it still has room for an available tile, then a possible move definitely exists
    if(get_available_tiles(game_info).length != 0) {
        return false;
    }

    //  The board may be full, but if there are any adjacent tiles that have the same value.
    //  then a valid move still exists.
    for(let i = 0; i < game_info.board.length; i++) {
        let up_neighbor = i - 4;
        let down_neighbor = i + 4;
        let left_neighbor = i - 1;
        let right_neighbor = i + 1;
        
        //  bounds check; because i is always within [0, length -1], 
        //it is safe to leave the neighbors out of bounds when comparing
        if(up_neighbor >= 0) up_neighbor = game_info.board[up_neighbor];
        if(down_neighbor < game_info.board.length) down_neighbor = game_info.board[down_neighbor];
        if(left_neighbor >= 0) left_neighbor = game_info.board[left_neighbor];
        if(right_neighbor < game_info.board.length) right_neighbor = game_info.board[right_neighbor];
        
        const value = game_info.board[i];
        if(value == up_neighbor || value == down_neighbor || value == left_neighbor || value == right_neighbor) {
            return false;
        }
    }
    return true;
}

/**
 * Returns a list of all valid moves that can be made.
 * @param game_info 
 */
export function get_valid_moves(game_info: GameInfo): number[] {
    let valid_moves: number[] = [];

    //  Valid moves are possible in a certain direction if a tile has an empty space in front of it
    //  or the tile in front of it is the same number
    let directions: number[] = [MOVE_UP, MOVE_RIGHT, MOVE_DOWN, MOVE_LEFT];
    for(let i = 0; i < 4; i++) {
        let direction: number = directions[i];
        let starting_tile: number[] = [];
        switch(direction) {
            case MOVE_UP:       starting_tile = [12, 13, 14, 15]; break;
            case MOVE_RIGHT:    starting_tile = [0, 4, 8, 12]; break;
            case MOVE_DOWN:     starting_tile = [0, 1, 2, 3]; break;
            case MOVE_LEFT:     starting_tile = [3, 7, 11, 15]; break;
        }
        for(let j = 0; j < starting_tile.length; j++) {
            for(let k = 0; k < 3; k++) {
                let tile: number = game_info.board[starting_tile[j] + k * direction];
                let next_tile: number = game_info.board[starting_tile[j] + (k + 1) * direction];
                
                if(tile != 0  // not an empty space
                && (next_tile == 0 || (tile == next_tile))) {
                    valid_moves.push(direction);
                    j = starting_tile.length;    //  break out;
                    break;
                }
            }
        }
    }
    return valid_moves;
}

/**
 * Makes a move on the game and returns the updated game.
 * @param game_info 
 * @param direction the direction the tiles will shift to.
 * @returns 
 */
export function make_move(game_info: GameInfo, direction: number): GameInfo {
    if(direction != MOVE_UP && direction != MOVE_RIGHT && direction != MOVE_DOWN && direction != MOVE_LEFT) {
        console.error("Invalid direction:", direction);
        return clone(game_info);
    }
    let new_game_info: GameInfo = clone(game_info);

    let valid_move_made: boolean = false;
    /*
        Move tiles in the direction, starting with the tiles closest to the direction
        so move the topmost tiles up first, the rightmost tiles right first, etc.
        
        For MOVE_UP = -4, we want to look at elements 0, 1, 2, 3 first in their columns.
        For MOVE_RIGHT = 1, we want to look at the 3, 7, 11, 15 first in their rows.
        For MOVE_DOWN = 4, we want to look at elements 12, 13, 14, 15 first in their columns.
        For MOVE_LEFT = -1, we want to look at the 0, 4, 8, 12 first in their rows.
        
    */
    let starting_tile: number[];
    switch(direction) {
        case MOVE_UP:       starting_tile = [0, 1, 2, 3]; break;
        case MOVE_RIGHT:    starting_tile = [3, 7, 11, 15]; break;
        case MOVE_DOWN:     starting_tile = [12, 13, 14, 15]; break;
        case MOVE_LEFT:     starting_tile = [0, 4, 8, 12]; break;
    }

    for(let i = 0; i < starting_tile.length; i++) {
        //  Tiles cannot merge more than once per move so we need to keep track.
        let merged_tiles: number[] = [];

        //  The tile closest in the direction can never move so it is skipped.
        for(let j = 1; j < 4; j++) {
            //  Because we start at the tile closest in the direction, we move backwards (-direction) for the next tiles.
            let board_index: number = starting_tile[i] - direction * j;

            //  Empty tile
            if(new_game_info.board[board_index] == 0) {
                continue;
            }

            //  Keep moving the tile in the direction until it reaches a tile.
            for(let k = 0; k < j; k++) {
                let next_tile_index: number = board_index + direction;
                //  Empty tiles are safe to move into
                if(new_game_info.board[next_tile_index] == 0) {
                    new_game_info.board[next_tile_index] = new_game_info.board[board_index]
                    new_game_info.board[board_index] = 0;
                    board_index = next_tile_index;
                    valid_move_made = true;
                }
                //  Merge candidate
                else if(!merged_tiles.includes(next_tile_index) && 
                new_game_info.board[board_index] == new_game_info.board[next_tile_index]) {
                    merged_tiles.push(next_tile_index);
                    
                    new_game_info.board[next_tile_index] *= 2;
                    new_game_info.board[board_index] = 0;
                    
                    valid_move_made = true;
                    break;
                }
                //  Unmergable tile
                else {
                    break;
                }
            }
        }
    }

    if(valid_move_made && !is_lost(new_game_info)) {
        new_game_info = add_random_tile(new_game_info);
    }
    else {
        console.log("Cannot add a new tile.");
    }
    return new_game_info;
}

/**
 * Returns a list of tiles that can move in the indicated direction.
 * @param game_info 
 * @param direction the direction the tiles will shift to.
 * @returns 
 */
export function get_movable_tiles(game_info: GameInfo, direction: number): MovingTile[] {
    let moving_tiles: MovingTile[] = [];

    if(direction != MOVE_UP && direction != MOVE_RIGHT && direction != MOVE_DOWN && direction != MOVE_LEFT) {
        console.error("Invalid direction:", direction);
        return moving_tiles;
    }

    let new_game_info: GameInfo = clone(game_info);

    /*
        Move tiles in the direction, starting with the tiles closest to the direction
        so move the topmost tiles up first, the rightmost tiles right first, etc.
        
        For MOVE_UP = -4, we want to look at elements 0, 1, 2, 3 first in their columns.
        For MOVE_RIGHT = 1, we want to look at the 3, 7, 11, 15 first in their rows.
        For MOVE_DOWN = 4, we want to look at elements 12, 13, 14, 15 first in their columns.
        For MOVE_LEFT = -1, we want to look at the 0, 4, 8, 12 first in their rows.
        
    */
    let starting_tile: number[];
    switch(direction) {
        case MOVE_UP:       starting_tile = [0, 1, 2, 3]; break;
        case MOVE_RIGHT:    starting_tile = [3, 7, 11, 15]; break;
        case MOVE_DOWN:     starting_tile = [12, 13, 14, 15]; break;
        case MOVE_LEFT:     starting_tile = [0, 4, 8, 12]; break;
    }

    for(let i = 0; i < starting_tile.length; i++) {
        //  Tiles cannot merge more than once per move so we need to keep track.
        let merged_tiles: number[] = [];

        //  The tile closest in the direction can never move so it is skipped.
        for(let j = 1; j < 4; j++) {
            //  Because we start at the tile closest in the direction, we move backwards (-direction) for the next tiles.
            let board_index: number = starting_tile[i] - direction * j;

            //  Empty tile
            if(new_game_info.board[board_index] == 0) {
                continue;
            }

            //  Keep moving the tile in the direction until it reaches a tile.
            let distance_travelled = 0;
            let added = false;
            let original_board_index = board_index;

            for(let k = 0; k < j; k++) {
                let next_tile_index: number = board_index + direction;
                //  Empty tiles are safe to move into
                if(new_game_info.board[next_tile_index] == 0) {
                    new_game_info.board[next_tile_index] = new_game_info.board[board_index]
                    new_game_info.board[board_index] = 0;
                    board_index = next_tile_index;

                    distance_travelled += 1;
                }
                //  Merge candidate
                else if(!merged_tiles.includes(next_tile_index) && 
                new_game_info.board[board_index] == new_game_info.board[next_tile_index]) {
                    merged_tiles.push(next_tile_index);
                    
                    new_game_info.board[next_tile_index] *= 2;
                    new_game_info.board[board_index] = 0;

                    distance_travelled += 1;
                    moving_tiles.push({index: original_board_index, direction: direction, length: distance_travelled});
                    break;
                }
                //  Unmergable tile
                else {
                    added = true;
                    if(distance_travelled > 0)
                        moving_tiles.push({index: original_board_index, direction: direction, length: distance_travelled});
                    break;
                }
            }
            if(!added && distance_travelled > 0) {
                moving_tiles.push({index: original_board_index, direction: direction, length: distance_travelled});
            }
        }
    }

    return moving_tiles;
}