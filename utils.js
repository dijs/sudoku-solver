export function verifyCell(puzzle, x, y) {
  const value = puzzle[y][x];
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

export function solve(puzzle) {
  return [];
}

export function generate() {
  return [];
}

export const mock = [
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
