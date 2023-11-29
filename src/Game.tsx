//  Styling based off Gabriele Cirulli's 2048 at https://play2048.co/
export function GameContainer(): JSX.Element {
    return (
        <>
            <div className="game no-select">
                <div className="game-grid grid grid-cols-4 gap-3 content-center">
                    <div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/>
                    <div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/>
                    <div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/>
                    <div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/><div className="grid-cell"/>
                </div>
            </div>
        </>
    );
}
