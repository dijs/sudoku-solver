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

export function findTriples(puzzle) {
  const triples = [];

  // check rows
  for (let y = 0; y < 9; y++) {
    let triplets = {};
    let counts = {};

    for (let x = 0; x < 9; x++) {
      const candidates = findCandidates(puzzle, x, y);
      if (candidates.length === 2 || candidates.length === 3) {
        let key = Array(9).fill(0);
        for (let n of candidates) {
          key[n] = 1;
        }

        const k = parseInt(key.join(''), 2);

        counts[k] = (counts[k] || 0) + 1;

        for (let u in counts) {
          const m = Math.min(u, k);
          const n = Math.max(u, k);
          if ((m & n) === m) {
            if (triplets[m]) {
              if (triplets[m].length < candidates.length) {
                triplets[m] = candidates;
              }
            } else {
              triplets[m] = candidates;
            }
            counts[m] = (counts[m] || 0) + 1;
          }
        }
      }
    }

    for (let u in counts) {
      if (counts[u] / 2 === 3) {
        triples.push({ y, triplet: triplets[u] });
      }
    }
  }

  return triples;
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

function isCompleted(puzzle) {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (puzzle[y][x] === 0) return false;
    }
  }
  return true;
}

export function solve(puzzle) {
  let current = [...puzzle];

  let steps = 0;
  let pos = { x: 0, y: 0 };

  while (steps < 512) {
    const single = findSingleCandidate(current, pos.x, pos.y);
    if (single) {
      console.log('solved single', single);
      current[pos.y][pos.x] = single;
    }
    pos = getNextEmptyPosition(current, pos);

    const doubles = findDoubles(current);

    for (let double of doubles) {
      const solution = solveDouble(current, double);
      if (solution) {
        console.log('solved double', solution.value);
        current[solution.y][solution.x] = solution.value;
      }
    }

    if (isCompleted(current)) {
      console.log('completed in', steps, 'steps');
      return current;
    }

    steps++;
  }

  console.log('need more juice...');

  return current;
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

export const easy2 = [
  [0, 2, 0, 0, 0, 0, 0, 0, 6],
  [5, 0, 0, 3, 1, 0, 0, 8, 0],
  [0, 0, 0, 0, 9, 6, 0, 5, 4],
  [0, 8, 2, 6, 4, 0, 0, 0, 0],
  [6, 0, 3, 0, 0, 0, 0, 0, 8],
  [0, 0, 0, 0, 0, 3, 0, 1, 0],
  [2, 1, 5, 0, 6, 8, 3, 0, 7],
  [0, 4, 0, 0, 0, 0, 9, 0, 1],
  [9, 0, 6, 1, 7, 4, 8, 0, 5],
];
