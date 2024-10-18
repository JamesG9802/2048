import { GameContainer } from "./Game";
import benh_tiles from './images/benh_tiles.png';
import random_moves_graph from './images/Random Moves Made.svg'
import perfect_loss from './images/perfect_loss.png'
import minmax_moves_graph from './images/Minmax Moves Made.svg'
import actorcritic_moves_graph from './images/ActorCritic Moves Made.png'
import github_icon_light from './images/github-mark.svg'
import github_icon_dark from './images/github-mark-white.svg'
import { minimax_move, random_move } from "./scripts/AntiSolver";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function Header(): JSX.Element  {
  return (
    <>
      <h1 className="text-5xl font-bold">
        2048 Anti-solver
      </h1>
      <h2 className="text-xl italic my-2">
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
      <h1 className="text-3xl font-bold p-3">Minimax Approach</h1>
      <p className="text-justify">
        A better approach to finding the fastest loss would be to use a more algorithmic solution. 
        <a href="https://en.wikipedia.org/wiki/Minimax" target="_blank" rel="noreferrer">Minimax</a> is an algorithm that minimizes losing scenarios and maximizes winning scenarios.
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
        The values of <MathJax inline hideUntilTypeset={"first"}>{`\\(w_{1}\\)`}</MathJax> and <MathJax inline hideUntilTypeset={"first"}>{`\\(w_{2}\\)`}</MathJax> can drastically affect performance.
        7 different weight configurations were experimented with and 100 games were simulated to a maximum depth of 5 
        to create the distribution below, Where
        the first number is <MathJax inline hideUntilTypeset={"first"}>{`\\(x\\)`}</MathJax>
        and the second number is <MathJax inline hideUntilTypeset={"first"}>{`\\(y\\)`}</MathJax>.
      </p>
      <img className="p-3" src={minmax_moves_graph}/>
      <p className="text-justify">
        The best values appear to be 16 for <MathJax inline hideUntilTypeset={"first"}>{`\\(x\\)`}</MathJax> and 1
        for <MathJax inline hideUntilTypeset={"first"}>{`\\(y\\)`}</MathJax>, resulting in an average of only
        38 moves needed to lose the game.
        A much better result when compared to 118.
      </p>
      <h1 className="text-3xl font-bold p-3">Reinforcement Learning</h1>
      <p className="text-justify">
        The next thing we can try is a machine learning approach.
        Convolutional Neural Networks (CNNs) are well suited to tasks where they can learn local features from image data.
        Since a 2048 game board is just a 4x4 grid, we can train a CNN to play the game with the objective of losing as fast as possible. 
      </p>
      <p className="text-justify">
        This class of problem is known as <a href="https://aws.amazon.com/what-is/reinforcement-learning/#:~:text=Reinforcement%20learning%20(RL)%20is%20a,use%20to%20achieve%20their%20goals" target="_blank" rel="noreferrer">Reinforcement Learning</a>, where agents learn to maximize their score in an environment. In this case, it would be trying to complete the 2048 game as fast as possible. 
        The specific algorithm I decided to use was the <a href="https://huggingface.co/blog/deep-rl-a2c" target="_blank" rel="noreferrer">Advantage Actor-Critic</a> algorithm, a technique that creates and trains two aptly named models: the "actor" and the "critic".
        The actor chooses a move to interact with the game (sliding up, down, left, or right) and the critic tries to determine how good the actor's move was.
      </p>
      <img className="p-3" src={actorcritic_moves_graph}/>
      <p className="text-justify">
        After 3,000 games, the model reached an 80 average moves to end the game.
        By 10,000 games it managed to lower it to 78. However, the performance stagnated by that point, barely reaching an average of 77 moves to end the game by 30,000 games.
      </p>
      <p className="text-justify">
        Compared to the pure algorithmic approaches, machine learning does an okay job at finding a way to end the game, but it is nothing spectatular.
        The main advantage it has compared to minimax is the vastly improved runtime performance due to not needing to perform repeated deep searches after each move.
      </p>
    </>
  );
}

function Source(): JSX.Element {
  const links = [
    ["https://play2048.co/", "2048 by Gabriele Cirulli"],
    ["https://github.com/macroxue/2048-ai", "Data by Hanhong Xue"],
    ["https://math.stackexchange.com/questions/727076/probability-that-random-moves-in-the-game-2048-will-win/727204#727204", "Data by Benh"],
    ["https://en.wikipedia.org/wiki/Minimax", "Minimax Algorithm"],
    ["https://aws.amazon.com/what-is/reinforcement-learning/#:~:text=Reinforcement%20learning%20(RL)%20is%20a,use%20to%20achieve%20their%20goals", "Reinforcement Learning"],
    ["https://huggingface.co/blog/deep-rl-a2c", "Advantage Actor Critic"],
  ]
  return (
    <>
      <h1 className="text-3xl font-bold p-3">Sources</h1>
      <ol className="px-8">
      {
        links.map((e)=> {
          return (
            <li className="list-decimal"><p className="text-justify">
              <a href={e[0]} target="_blank" rel="noreferrer">{e[1]}</a>
            </p></li>
          )
        })
      }
      </ol>
    </>
  )
}

function Footer(): JSX.Element {
  return (
    <>
      <footer className="rounded-t-lg mt-8 p-4 bg-light-300 dark:bg-dark-300">
        <p className="text-justify">
          <a href="https://github.com/JamesG9802/2048" target="_blank" rel="noreferrer">
          <img className="w-8 h-8 mx-4 inline-block dark:hidden" src={github_icon_light}/>
          <img className="w-8 h-8 mx-4 hidden dark:inline-block" src={github_icon_dark}/>
          </a>
          Made with React + Vite + Tailwind.
        </p>
      </footer>
    </>
  )
}

export default function App(): JSX.Element {
  return (
    <>
      <MathJaxContext>
      <div id="content" className="max-w-lg mx-auto text-center">
        <Header/>
        <Content/>
        <Source/>
        <Footer/>
      </div>
      </MathJaxContext>
    </>
  )
}