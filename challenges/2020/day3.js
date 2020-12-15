const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const map = logTime('Parse', () => readLines('input/2020/aoc3.txt').map(parse));
const tree = '#';

function parse(row) {
  return row.split('');
}

function findTreesOnSlope(map, { right, down }) {
  let x = 0,
    y = 0,
    treesEncountered = 0;
  while (y < map.length) {
    if (map[y][x] === tree) {
      treesEncountered++;
    }
    x = (x + right) % map[0].length;
    y += down;
  }
  return treesEncountered;
}

function findBestSlope(map) {
  return [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ]
    .map((slope) => findTreesOnSlope(map, slope))
    .reduce((acc, x) => acc * x, 1);
}

logTime('A', () => findTreesOnSlope(map, { right: 3, down: 1 }));
logTime('B', () => findBestSlope(map));
