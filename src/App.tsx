import { GameContainer } from "./Game";
import benh_tiles from './images/benh_tiles.png';
import random_moves_graph from './images/Random Moves Made.svg'

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
      <p>
        Losing specifically is not difficult to accomplish. You could after all just play moves completely randomly.
        Benh on <a href="https://math.stackexchange.com/a/727204">StackExchange</a> posted a sample of one million games played randomly. 
        Not a single game managed to combine a tile to 1024.
      </p>
      <img className="p-3" src={benh_tiles}/>
      <p>
        It is, however, surprising how long it takes to actually lose just playing random games.
        You can try it yourself by using WASD, the arrow keys, or by clicking the button to play random moves automatically.
      </p>
      <GameContainer></GameContainer>
      <img className="p-3" src={random_moves_graph}/>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <>
      <div id="content" className="max-w-lg mx-auto text-center">
        <Header></Header>
        <Content></Content>
      </div>
    </>
  )
}