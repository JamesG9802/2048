
import random

import torch
from torch import float32, int32

class Environment:
    _UP_STARTING_TILES = [0, 1, 2, 3]
    _RIGHT_STARTING_TILES = [3, 7, 11, 15]
    _DOWN_STARTING_TILES = [12, 13, 14, 15]
    _LEFT_STARTING_TILES = [0, 4, 8, 12]
    
    BOARD_SIZE = 16
    ROWS = 4
    COLS = 4
    INITIAL_TILES = 2

    def __init__(self, logger=None):
        self.logger = logger if logger else print
        self.Board = [0] * self.BOARD_SIZE
        self.Timestep = 0

    def reset(self, seed=0):
        if seed != 0:
            random.seed(seed)
            torch.manual_seed(seed)
        else:
            random.seed()
            torch.manual_seed(random.randint(0, 2**32 - 1))
        
        random_order = torch.randperm(16, dtype=int32)
        self.Board = [0] * self.BOARD_SIZE

        for i in range(self.INITIAL_TILES):
            self.Board[random_order[i].item()] = 1 + (random.randint(0, 9) // 9)

        self.Timestep = 0

    def player_step(self, direction):
        if direction == 0:
            slide_direction = -4
            starting_tiles = self._UP_STARTING_TILES
        elif direction == 1:
            slide_direction = 1
            starting_tiles = self._RIGHT_STARTING_TILES
        elif direction == 2:
            slide_direction = 4
            starting_tiles = self._DOWN_STARTING_TILES
        elif direction == 3:
            slide_direction = -1
            starting_tiles = self._LEFT_STARTING_TILES

        merged_tiles = []
        for i in range(self.ROWS):
            merged_tiles.clear()
            for j in range(1, self.COLS):
                board_index = starting_tiles[i] - slide_direction * j
                if self.Board[board_index] == 0:
                    continue

                for _ in range(j):
                    next_tile_index = board_index + slide_direction
                    if self.Board[next_tile_index] == 0:
                        self.Board[next_tile_index] = self.Board[board_index]
                        self.Board[board_index] = 0
                        board_index = next_tile_index
                    elif next_tile_index not in merged_tiles and self.Board[board_index] == self.Board[next_tile_index]:
                        merged_tiles.append(next_tile_index)
                        self.Board[next_tile_index] += 1
                        self.Board[board_index] = 0
                        break
                    else:
                        break

        self.Timestep += 1
        return self.is_game_over()

    def machine_step(self, tile, value):
        if self.Board[tile] != 0:
            self.logger(f"Error: Trying to place {value} at index {tile} when already occupied.")
            return self.is_game_over()
        
        self.Board[tile] = value
        self.Timestep += 1
        return self.is_game_over()

    def can_slide_board(self, direction):
        if direction == 0:
            slide_direction = -4
            starting_tiles = self._UP_STARTING_TILES
        elif direction == 1:
            slide_direction = 1
            starting_tiles = self._RIGHT_STARTING_TILES
        elif direction == 2:
            slide_direction = 4
            starting_tiles = self._DOWN_STARTING_TILES
        elif direction == 3:
            slide_direction = -1
            starting_tiles = self._LEFT_STARTING_TILES

        for i in range(self.ROWS):
            for j in range(1, self.COLS):
                board_index = starting_tiles[i] - slide_direction * j
                if self.Board[board_index] == 0:
                    continue

                next_tile_index = board_index + slide_direction
                if self.Board[next_tile_index] == 0 or self.Board[board_index] == self.Board[next_tile_index]:
                    return True
        return False

    def is_game_over(self):
        return not any(self.can_slide_board(i) for i in range(4))

    def player_observe(self):
        observation = torch.tensor(self.Board, dtype=float32).reshape(1, 4, 4)
        mask = [1 if self.can_slide_board(i) else 0 for i in range(4)]
        return observation, torch.tensor(mask)

    def machine_observe(self):
        observation = torch.tensor(self.Board, dtype=float32).reshape(1, 4, 4)
        mask = [(1 if self.Board[i] == 0 else 0) for i in range(self.BOARD_SIZE)]
        mask.extend(mask)  # Duplicate mask for 4pt tile
        return observation, torch.tensor(mask)

    def __str__(self):
        result = ""
        for i in range(self.ROWS):
            result += " ".join([f"{2**self.Board[i * self.COLS + j]}" if self.Board[i * self.COLS + j] != 0 else "_" for j in range(self.COLS)]) + "\n"
        return result
