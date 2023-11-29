import { GameContainer } from "./Game";

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
      <GameContainer></GameContainer>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <>
      <div id="content" className="max-w-md mx-auto text-center">
        <Header></Header>
        <Content></Content>
      </div>
    </>
  )
}