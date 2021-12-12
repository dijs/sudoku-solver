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

function findSolutions(puzzle, x, y) {
  return possibleNumbers.filter((n) => verifyCell(puzzle, x, y, n));
}

export function step(puzzle, x = 0, y = 0) {
  // backtracking is using the choose -> explore -> unchoose

  // find obvious unique solution for cell
  let solutions = findSolutions(puzzle, x, y);

  return solutions.length === 1 ? solutions[0] : null;
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
