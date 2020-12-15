const { readLines } = require('../utils/readandwrite');
const { find, uniq } = require('lodash');
const IntCodeComputer = require('../common/icc');
const UP_ARROW = '^'.charCodeAt(0);
const RIGHT_ARROW = '>'.charCodeAt(0);
const LEFT_ARROW = '<'.charCodeAt(0);
const DOWN_ARROW = 'v'.charCodeAt(0);


function getScaffolds(out, ...filter) {
  let y = 0;
  let x = 0;
  return out.map((p) => {
    const point =  { x, y, scaffold: p };
    if (p === 10) {
      x = 0;
      y++;
      return null;
    }
    x++;
    return point;
  }).filter(x => !!x)
    .filter(x => filter.includes(x.scaffold))
    .map((p, i, scaffolds) => {
      const left = find(scaffolds, {x: p.x - 1, y: p.y});
      const right = find(scaffolds, {x: p.x + 1, y: p.y});
      const up = find(scaffolds, {x: p.x, y: p.y - 1});
      const down = find(scaffolds, {x: p.x, y: p.y + 1});
      p.options = [left, right, up, down].filter(x => !!x);
      return p;
    });
}

function part1(file) {
  console.time('aoc17p1');
  const input = readLines(file)[0].split(',').map(Number);
  const out = new IntCodeComputer(input, [], 0).run();
  const r = getScaffolds(out, 35).filter(({options}) => {
    return options.length === 4;
  }).map(({x, y}) => x * y).reduce((a, b) => a + b, 0);
  console.timeEnd('aoc17p1');
  return r;
}
function getNextPositions(scaffolds, point, previousX, previousY) {
  return scaffolds.filter(({options}) => !!find(options, p => p.x === point.x && p.y === point.y)).filter(({x, y}) => x !== previousX && y !== previousY);
}
const LEFT = 'L';
const RIGHT = 'R';

function getBeginMove(scaffolds, begin) {
  const nextMoves = getNextPositions(scaffolds, begin, null, null);
  if (nextMoves.length > 1) {
    throw new Error('Willy Wonka!');
  }
  const nextMove = nextMoves[0];
  const beginPosition = begin.scaffold;
  if(nextMove.x === begin.x && nextMove.y === begin.y - 1) { // is down
    switch(beginPosition) {
      case RIGHT_ARROW: return RIGHT;
      case DOWN_ARROW: return '';
      case LEFT_ARROW: return LEFT;
      default: throw new Error('Invalid Move');
    }
  } else if (nextMove.x === begin.x && nextMove.y === begin.y + 1) { // is up
    switch(beginPosition) {
      case RIGHT_ARROW: return LEFT;
      case UP_ARROW: return '';
      case LEFT_ARROW: return RIGHT;
      default: throw new Error('Invalid Move');
    }
  } else if (nextMove.x === begin.x - 1 && nextMove.y === begin.y) { // is left
    switch(beginPosition) {
      case DOWN_ARROW: return RIGHT;
      case UP_ARROW: return LEFT;
      case LEFT_ARROW: return '';
      default: throw new Error('Invalid Move');
    }
  } else if (nextMove.x === begin.x + 1 && nextMove.y === begin.y) { // is right
    switch(beginPosition) {
      case DOWN_ARROW: return LEFT;
      case UP_ARROW: return RIGHT;
      case RIGHT_ARROW: return '';
      default: throw new Error('Invalid Move');
    }
  }
  throw new Error('Invalid Move');
}

function print(scaffolds, currentpos) {
  const highestX = max(scaffolds.map(s => s.x)) + 1;
  const highestY = max(scaffolds.map(s => s.y)) + 1;
  let result = '';
  for (let y = 0; y < highestY; y++) {
    for (let x = 0; x < highestX; x++) {
      const point = find(scaffolds, {x, y});
      if (point) {
        if (currentpos.x === x && currentpos.y === y && point.scaffold === 35) {
          result += ` o `;
        } else {
          result += ` ${String.fromCharCode(point.scaffold)} `;
        }
      } else {
        result += '   ';
      }
    }
    result += '\n';
  }
  console.log(result);
}
const UP = 'U';
const DOWN = 'D';

function part2(file) {
  console.time('aoc17p2');
  const input = readLines(file)[0].split(',').map(Number);

  const instructions = [
    ...'ABACBCBCAB'.split('').join(',').split('').map(x => x.charCodeAt(0)),10,
    ...'L6L4R8'.split('').join(',').split('').map(x => x.charCodeAt(0)),10,
    ...'R,8,L,6,L,4,L,10,R,8'.split('').map(x => x.charCodeAt(0)),10,
    ...'L4R4L4R8'.split('').join(',').split('').map(x => x.charCodeAt(0)),10,
    'y'.charCodeAt(0), 10,
  ];
  
  // TODO calculate automatically
  // L6L4R8R8L6L4L10R8L6L4R8L4R4L4R8R8L6L4L10R8L4R4L4R8R8L6L4L10R8L4R4L4R8L6L4R8R8L6L4L10R8

  input[0] = 2;
  let res = 0;

  function output(result, value) {
      if (value > 255) {
          res = value;
      }
  }

  function move() {
      return instructions.shift();
  }

  const computer = new IntCodeComputer(input, [], 0, output, move, false);

  computer.run(); 
  console.timeEnd('aoc17p2');

  return res;
}
console.log(`Part #1: ${part1('input/aoc17.txt')}`)
console.log(`Part #2: ${part2('input/aoc17.txt')}`)
module.exports = {
  part1, part2
};