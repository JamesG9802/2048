# Random Games
For random games (n=100,000), on average games took 118.38896 moves to complete and a median of 115 moves to complete.
The fastest a game was completed was in 19 moves. The longest game took 477 moves.
# Minmax Games
A minmax algorithm can be used as a solver, the only question is how to define the evaluation function for a good move.
Upon examining the 'perfect' game, it appears that good moves should be those that reduce the number of empty tiles and 
reduce the number of tiles with neighbors of equal value or,

w1 * # of empty tiles + w2 * # of equal neigbors.

A series of different weight combinations were experimented with:
- w1 = 1,   w2 = 1
- w1 = 4,   w2 = 1
- w1 = 16,  w2 = 1
- w1 = 1,   w2 = 4
- w2 = 1,   w2 = 16
- w1 = 1,   w1 = 0
- w1 = 0,   w1 = 1

Upon running minimax with 100 games up to a maximum depth of 5, the best combination was w1 = 16, w2 = 1 with an average of 38 moves.