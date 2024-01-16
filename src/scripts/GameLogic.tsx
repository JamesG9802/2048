export interface GameInfo {
    board: number[],
};

/**
 * Initialize the game.
 */
export function initialize(): GameInfo {
    let new_board: number[] = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]

    return {
        board: new_board
    }
}

/**
 * Clones a game info object.
 * @param game_info 
 */
export function clone(game_info: GameInfo): GameInfo {
    return {
        board: [...game_info.board]
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
        game_info.board[get_random_available_tile(game_info)] = cell_value;
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