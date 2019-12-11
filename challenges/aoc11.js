const { readLines } = require('../utils/readandwrite');
const { uniqBy, find } = require('lodash');
const IntCodeRunner = require('../common/icc');

function part1(file) {
  console.time('aoc11p1');
  const input = readLines(file)[0].split(',').map(Number);
  let count = 0;
  let lastX = 0;
  let lastY = 0;
  let lastDirection = 'UP';
  const coordinates = [];
  const program = new IntCodeRunner(input, [], 2);
  do {
    let coordinate = find(coordinates, { x: lastX, y: lastY });
    const result = program.run(coordinate && coordinate.color || 0);
    if (result.length === 0) {
      break;
    }
    const [color, direction] = result;
    console.log(program.memory);
    coordinates.push({x: lastX, y: lastY, color });
    program.clear();
    if (lastDirection === 'UP') {
      lastDirection = direction === 0 ? 'LEFT' : 'RIGHT';
    } else if (lastDirection === 'DOWN') {
      lastDirection = direction === 0 ? 'RIGHT' : 'LEFT';
    } else if (lastDirection === 'RIGHT') {
      lastDirection = direction === 0 ? 'UP' : 'DOWN';
    } else {
      lastDirection = direction === 0 ? 'DOWN' : 'UP';
    }
    if (lastDirection === 'UP') {
      lastY--;
    } else if (lastDirection === 'DOWN') {
      lastY++;
    } else if (lastDirection === 'RIGHT') {
      lastX++;
    } else {
      lastX--;
    }
  } while(true);
  console.timeEnd('aoc11p1');
  return coordinates;
}

function part2(file) {
  console.time('aoc11p2');
  const input = readLines(file);

  
  console.timeEnd('aoc11p2');
  return result;
}

console.log(uniqBy(part1('input/aoc11.txt'), x => x.x + '-' + x.y).length);

module.exports = {
  part1, part2
};


