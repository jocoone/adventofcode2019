const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const CYCLES = 6;

const input = readLines('input/2020/aoc17.txt');

const i3 = logTime('Parse 3 dimensional', () => parse3(input, CYCLES));
const i4 = logTime('Parse 4 dimensional', () => parse4(input, CYCLES));

function parse3(input, cycles) {
  const grid = [];
  let emptyRow = [];
  for (let x = 0; x < input[0].length + 2 * cycles; x++) {
    emptyRow.push('.');
  }
  grid.push(input.map((line) => line.split('')));
  for (let i = 0; i < cycles; i++) {
    grid[0].forEach((row) => {
      row.unshift('.');
      row.push('.');
    });
    grid[0].unshift([...emptyRow]);
    grid[0].push([...emptyRow]);
  }
  for (let i = 0; i < cycles; i++) {
    let extraZ = [];
    for (let y = 0; y < input.length + 2 * cycles; y++) {
      extraZ.push([...emptyRow]);
    }
    grid.unshift([...extraZ]);
    grid.push([...extraZ]);
  }

  return grid;
}

function parse4(input, cycles) {
  const grid = [];
  let emptyRow = [];
  for (let x = 0; x < input[0].length + 2 * cycles; x++) {
    emptyRow.push('.');
  }
  grid.push(parse3(input, cycles));
  for (let i = 0; i < cycles; i++) {
    let extraW = [];
    for (let y = 0; y < input.length + 2 * cycles; y++) {
      let extraZ = [];
      for (let l = 0; l < input.length + 2 * cycles; l++) {
        extraZ.push([...emptyRow]);
      }
      extraW.push([...extraZ]);
    }
    grid.unshift(extraW);
    grid.push(extraW);
  }
  return grid;
}

function print(input, cycle) {
  let result = `--------- Cycle ${cycle} ----------\n`;
  input.forEach((zz, z) => {
    result += `z = ${z - Math.floor(input.length / 2)}\n`;
    zz.forEach((yy, y) => {
      yy.forEach((xx, x) => {
        result += xx;
      });
      result += '\n';
    });
    result += '\n';
  });
  console.log(result);
}

function getActiveNeighbours3({ x, y, z }, grid) {
  let count = 0;

  for (let zz = -1; zz <= 1; zz++) {
    for (let yy = -1; yy <= 1; yy++) {
      for (let xx = -1; xx <= 1; xx++) {
        if (!(xx === 0 && yy === 0 && zz === 0)) {
          if (
            grid[z + zz] &&
            grid[z + zz][y + yy] &&
            grid[z + zz][y + yy][x + xx] === '#'
          ) {
            count++;
          }
          if (count > 3) {
            return count;
          }
        }
      }
    }
  }

  return count;
}

function getActiveNeighbours4({ x, y, z, w }, grid) {
  let count = 0;
  for (let ww = -1; ww <= 1; ww++) {
    for (let zz = -1; zz <= 1; zz++) {
      for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
          if (!(xx === 0 && yy === 0 && zz === 0 && ww === 0)) {
            if (
              grid[w + ww] &&
              grid[w + ww][z + zz] &&
              grid[w + ww][z + zz][y + yy] &&
              grid[w + ww][z + zz][y + yy][x + xx] == '#'
            ) {
              count++;
            }
            if (count > 3) {
              return count;
            }
          }
        }
      }
    }
  }
  return count;
}

function solveA(grid, cycles) {
  let intermediateState = [...grid.map((y) => [...y.map((x) => [...x])])];

  let cycle = 0;
  do {
    grid.forEach((zz, z) => {
      zz.forEach((yy, y) => {
        yy.forEach((xx, x) => {
          const active = getActiveNeighbours3(
            {
              x,
              y,
              z,
            },
            grid
          );
          if (xx === '#') {
            if (active === 2 || active === 3) {
              intermediateState[z][y][x] = '#';
            } else {
              intermediateState[z][y][x] = '.';
            }
          } else {
            if (active === 3) {
              intermediateState[z][y][x] = '#';
            }
          }
        });
      });
    });
    grid = [...intermediateState.map((y) => [...y.map((x) => [...x])])];
  } while (++cycle < cycles);
  return grid.reduce(
    (accZ, z) =>
      accZ + z.reduce((accY, y) => accY + y.filter((x) => x === '#').length, 0),
    0
  );
}

function solveB(grid, cycles) {
  let intermediateState = [
    ...grid.map((z) => [...z.map((y) => [...y.map((x) => [...x])])]),
  ];
  let cycle = 0;
  do {
    grid.forEach((ww, w) => {
      ww.forEach((zz, z) => {
        zz.forEach((yy, y) => {
          yy.forEach((xx, x) => {
            const active = getActiveNeighbours4({ x, y, z, w }, grid);
            if (xx === '#') {
              if (active === 2 || active === 3) {
                intermediateState[w][z][y][x] = '#';
              } else {
                intermediateState[w][z][y][x] = '.';
              }
            } else {
              if (active === 3) {
                intermediateState[w][z][y][x] = '#';
              }
            }
          });
        });
      });
    });
    grid = [
      ...intermediateState.map((z) => [
        ...z.map((y) => [...y.map((x) => [...x])]),
      ]),
    ];
  } while (++cycle < cycles);
  return grid.reduce(
    (accW, w) =>
      accW +
      w.reduce(
        (accZ, z) =>
          accZ +
          z.reduce((accY, y) => accY + y.filter((x) => x === '#').length, 0),
        0
      ),
    0
  );
}

logTime('A', () => solveA(i3, CYCLES));
logTime('B', () => solveB(i4, CYCLES));
