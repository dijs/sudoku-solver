import Head from 'next/head';
import { useState } from 'react';
import Puzzle from '../components/Puzzle';
import {
  getNextEmptyPosition,
  easy2,
  hard,
  solve,
  singleStep,
  doubleStep,
  findTriples,
} from '../utils';

export default function Home() {
  const [showHints, setShowHints] = useState(true);
  const [puzzle, setPuzzle] = useState(easy2);
  const [logs, setLogs] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function doTripleStep() {
    console.log(findTriples(puzzle));
  }

  function doDoubleStep() {
    const solution = doubleStep(puzzle);

    if (solution) {
      const temp = JSON.parse(JSON.stringify(puzzle));
      const { x, y, value } = solution;
      setLogs([
        `Found naked pair @ (${x},${y}) with solution ${value}`,
        ...logs,
      ]);
      temp[y][x] = value;
      setPuzzle(temp);
      setPosition({ x, y });
    }
  }

  function doStep() {
    const solution = singleStep(puzzle, position.x, position.y);
    if (solution) {
      const temp = JSON.parse(JSON.stringify(puzzle));
      temp[position.y][position.x] = solution;
      setLogs([
        `Found single @ (${position.x},${position.y}) with solution ${solution}`,
        ...logs,
      ]);
      setPuzzle(temp);
    }
    setPosition(getNextEmptyPosition(puzzle, position));
  }

  return (
    <div>
      <Head>
        <title>Sudoku Solver</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Puzzle puzzle={puzzle} highlight={position} showHints={showHints} />
        <div className="actions">
          <button onClick={doStep}>SINGLE STEP</button>
          <button onClick={doDoubleStep}>PAIR STEP</button>
          {/* <button onClick={doTripleStep}>TRIPLE STEP</button> */}
          <button
            onClick={() => {
              setPuzzle(solve(puzzle));
            }}
          >
            SOLVE PUZZLE
          </button>
          <button onClick={() => setShowHints(!showHints)}>
            {showHints ? 'HIDE' : 'SHOW'} HINTS
          </button>
        </div>
        {logs.length > 0 && (
          <div className="logs">
            {logs.map((log) => (
              <div className="message" key={log}>
                {log}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
