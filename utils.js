const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function verifyCell(puzzle, x, y, value) {
  // unique in row
  for (let dx = 0; dx < 9; dx++) {
    if (dx !== x && puzzle[y][dx] === value) return false;
  }
  // unique in column
  for (let dy = 0; dy < 9; dy++) {
    if (dy !== y && puzzle[dy][x] === value) return false;
  }
  const bx = (x / 3) | 0;
  const by = (y / 3) | 0;
  // unique in block
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const _x = bx * 3 + dx;
      const _y = by * 3 + dy;
      if (x !== _x && y !== _y && puzzle[_y][_x] === value) return false;
    }
  }
  return true;
}

export function findCandidates(puzzle, x, y) {
  return possibleNumbers.filter((n) => verifyCell(puzzle, x, y, n));
}

function findSingleCandidate(puzzle, x, y) {
  const candidates = findCandidates(puzzle, x, y);
  return candidates.length === 1 ? candidates[0] : null;
}

function findDoubles(puzzle) {
  const doubles = [];

  // check rows
  for (let y = 0; y < 9; y++) {
    let pairs = {};
    for (let x = 0; x < 9; x++) {
      const candidates = findCandidates(puzzle, x, y);
      if (candidates.length === 2) {
        const key = candidates.join('.');
        if (pairs[key] === 1) {
          doubles.push({ y, pair: candidates });
        } else {
          pairs[key] = 1;
        }
      }
    }
  }

  // check columns
  for (let x = 0; x < 9; x++) {
    let pairs = {};
    for (let y = 0; y < 9; y++) {
      const candidates = findCandidates(puzzle, x, y);
      if (candidates.length === 2) {
        const key = candidates.join('.');
        if (pairs[key] === 1) {
          doubles.push({ x, pair: candidates });
        } else {
          pairs[key] = 1;
        }
      }
    }
  }

  // check blocks
  for (let by = 0; by < 3; by++) {
    for (let bx = 0; bx < 3; bx++) {
      //
      let pairs = {};

      for (let dx = 0; dx < 3; dx++) {
        for (let dy = 0; dy < 3; dy++) {
          const x = bx * 3 + dx;
          const y = by * 3 + dy;

          const candidates = findCandidates(puzzle, x, y);
          if (candidates.length === 2) {
            const key = candidates.join('.');
            if (pairs[key] === 1) {
              doubles.push({ block: [bx, by], pair: candidates });
            } else {
              pairs[key] = 1;
            }
          }
        }
      }
    }
  }

  return doubles;
}

function solveDouble(puzzle, double) {
  if (double.y !== undefined) {
    for (let x = 0; x < 9; x++) {
      if (puzzle[double.y][x] !== 0) continue;
      const candidates = findCandidates(puzzle, x, double.y).filter(
        (n) => !double.pair.includes(n)
      );
      if (candidates.length === 1) {
        return { x, y: double.y, value: candidates[0], horizontal: true };
      }
    }
  }

  if (double.x !== undefined) {
    for (let y = 0; y < 9; y++) {
      if (puzzle[y][double.x] !== 0) continue;
      const candidates = findCandidates(puzzle, double.x, y).filter(
        (n) => !double.pair.includes(n)
      );
      if (candidates.length === 1) {
        return { x: double.x, y, value: candidates[0], vertical: true };
      }
    }
  }

  if (double.block !== undefined) {
    const [bx, by] = double.block;

    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const x = bx * 3 + dx;
        const y = by * 3 + dy;
        if (puzzle[y][x] === 0) {
          const candidates = findCandidates(puzzle, x, y).filter(
            (n) => !double.pair.includes(n)
          );
          if (candidates.length === 1) {
            return { x, y, value: candidates[0], block: true };
          }
        }
      }
    }
  }

  return null;
}

export function doubleStep(puzzle) {
  const doubles = findDoubles(puzzle);

  for (let double of doubles) {
    const solution = solveDouble(puzzle, double);
    if (solution) return solution;
  }

  return null;
}

export function singleStep(puzzle, x = 0, y = 0) {
  return findSingleCandidate(puzzle, x, y);
}

function getNextPosition(position) {
  if (position.x === 8 && position.y === 8) return { x: 0, y: 0 };
  let x = position.x + 1;
  let y = position.y;
  if (x >= 9) {
    x = 0;
    y++;
  }
  return { x, y };
}

export function getNextEmptyPosition(puzzle, position) {
  let check = 100;
  let pos = getNextPosition(position);
  while (check--) {
    if (puzzle[pos.y][pos.x] === 0) return pos;
    pos = getNextPosition(pos);
  }
  return pos;
}

function isCompleted(puzzle) {}

export function solve(puzzle) {
  // backtracking is using the choose -> explore -> unchoose
  return step(puzzle, [], 0);
}

export function generate() {
  return [];
}

export const hard = [
  [0, 0, 0, 0, 4, 0, 9, 5, 0],
  [0, 8, 0, 0, 9, 0, 0, 0, 7],
  [0, 6, 0, 5, 0, 0, 0, 2, 3],
  [0, 4, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 6, 7, 4, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 8, 0],
  [4, 3, 0, 0, 0, 1, 0, 7, 0],
  [8, 0, 0, 0, 3, 0, 0, 4, 0],
  [0, 2, 7, 0, 8, 0, 0, 0, 0],
];

export const easy = [
  [0, 0, 0, 0, 1, 0, 4, 0, 5],
  [6, 0, 5, 0, 0, 0, 9, 1, 0],
  [0, 4, 0, 2, 0, 0, 0, 0, 0],
  [7, 6, 2, 0, 3, 1, 5, 0, 8],
  [0, 0, 0, 0, 2, 8, 0, 6, 0],
  [5, 1, 0, 0, 7, 4, 3, 2, 9],
  [0, 0, 0, 0, 5, 0, 0, 9, 0],
  [8, 5, 0, 3, 6, 0, 0, 0, 0],
  [2, 0, 4, 1, 0, 0, 0, 0, 3],
];
