import { GameContainer } from "./Game";
import benh_tiles from './images/benh_tiles.png';
import random_moves_graph from './images/Random Moves Made.svg'
import perfect_loss from './images/perfect_loss.png'
import minmax_moves_graph from './images/Minmax Moves Made.svg'
import { minimax_move, random_move } from "./scripts/AntiSolver";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function Header(): JSX.Element  {
  return (
    <>
      <h1 className="text-5xl font-bold">
        2048 Anti-solver
      </h1>
      <h2 className="text-xl">
        Failing 2048 as fast as possible.
      </h2>

    </>
  );
}

function Content(): JSX.Element  {
  return (
    <>
      <p className="text-justify">
        2048 is a popular puzzle game created in 2014 by Gabriele Cirulli and is hosted at <a href="https://play2048.co/">https://play2048.co/</a>.
        Several people have made algorithms for the game in an attempt to maximize the score. 
        Hanhong Xue has a <a href="https://github.com/macroxue/2048-ai">GitHub</a> compiling the results of AI solvers and their scores. 
        Solvers are strong enough at this point to have 99.7% chance of reaching at least 8192. 
        Winning the game at this point is pretty easy at this point. 
      </p>
      <h1 className="text-3xl font-bold p-3">But what about losing?</h1>
      <p className="text-justify">
        Losing specifically is not difficult to accomplish. You could after all just play moves completely randomly.
        Benh on <a href="https://math.stackexchange.com/a/727204">StackExchange</a> posted a sample of one million games played randomly. 
        Not a single game managed to combine a tile to 1024.
      </p>
      <img className="p-3" src={benh_tiles}/>
      <p className="text-justify">
        It is, however, surprising how long it takes to actually lose just playing random games.
        You can try it yourself by using WASD, the arrow keys, or by clicking the button to play random moves automatically.
      </p>
      <GameContainer move_chooser={random_move}></GameContainer>
      <p className="text-justify p-3">
        Running 100,000 games of 2048 with moves chosen randomly results in a high number of moves on average needed to lose the game: ~118 moves. 
      </p>
      <img className="p-3" src={random_moves_graph}/>
      <p className="text-justify p-3">
        There are 16 tiles in 2048 that all need to be filled up for the game to be lost. 
        2048 starts with 2 tiles already placed randomly on the board. 
        New tiles are placed after a move is made to shift the tiles.
        Assuming that you were perfectly lucky, that you need at minimum 12 moves to lose the game.
      </p>
      <img className="p-3" src={perfect_loss}/>
      <h1 className="text-3xl font-bold p-3">Minmax Approach</h1>
      <p className="text-justify">
        A better approach to finding the fastest loss would be to use a more algorithmic solution. 
        Minimax is an algorithm that minimizes losing scenarios and maximizes winning scenarios.
        In our case, a good move is one that reduces the number of empty spaces and minimizes the number of equivalent adjacent tiles.
        The evaluation function can be formally specified as:
      </p>
      <MathJax hideUntilTypeset={"first"}>
          {`\\[f(x)=w_{1}x+w_{2}y\\]`}
      </MathJax>
      <p className="text-justify">
        Where <MathJax inline hideUntilTypeset={"first"}>{`\\(x\\)`}</MathJax> is the number of occupied spaces
        and <MathJax inline hideUntilTypeset={"first"}>{`\\(y\\)`}</MathJax> is the number of equal adjacent neighbors.
        <MathJax inline hideUntilTypeset={"first"}>{`\\(w_{1}\\)`}</MathJax> 
        and <MathJax inline hideUntilTypeset={"first"}>{`\\(w_{2}\\)`}</MathJax> are the corresponding weights and have been set to
        16 and 1, respectively for the solver. 
        You can see the minimax algorithm at work below.
      </p>
      <GameContainer move_chooser={minimax_move}></GameContainer>
      <p className="text-justify">
        The values of <MathJax inline hideUntilTypeset={"first"}>{`\\(w_{1}\\)`}</MathJax> 
        and <MathJax inline hideUntilTypeset={"first"}>{`\\(w_{2}\\)`}</MathJax> can drastically affect performance.
        7 different weight configurations were experimented with and 100 games were simulated to a maximum depth of 5 
        to create the distribution below, Where
        the first number is <MathJax inline hideUntilTypeset={"first"}>{`\\(x\\)`}</MathJax>
        and the second number is <MathJax inline hideUntilTypeset={"first"}>{`\\(y\\)`}</MathJax>.
      </p>
      <img className="p-3" src={minmax_moves_graph}/>
      <p className="text-justify">
        The best values appear to be 16 for <MathJax inline hideUntilTypeset={"first"}>{`\\(x\\)`}</MathJax> and 1
        for <MathJax inline hideUntilTypeset={"first"}>{`\\(y\\)`}</MathJax>, resulting in an average of only
        38 moves needed to lose the game. A much better result compared to 118.
      </p>
      <h1 className="text-3xl font-bold p-3">Expectimax</h1>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <>
      <MathJaxContext>
      <div id="content" className="max-w-lg mx-auto text-center">
        <Header></Header>
        <Content></Content>
      </div>
      </MathJaxContext>
    </>
  )
}