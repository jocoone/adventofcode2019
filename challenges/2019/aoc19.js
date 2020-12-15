const { readLines } = require('../utils/readandwrite');
const { find, maxBy, minBy } = require('lodash');
const IntCodeComputer = require('../common/icc');

function part1(file) {
    console.time('aoc19p1');
    const input = readLines(file)[0].split(',').map(Number);
    const numbers = [];
    for(let y = 0; y < 50; y++){
      for (let x = 0; x < 50; x++) {
        numbers.push(x);
        numbers.push(y);
      }
    }
    let res = 0;
    while(numbers.length > 0) {
      res += new IntCodeComputer(input, numbers, 0).run().shift();
    }
    console.timeEnd('aoc19p1');
    return res;
  }

  function trackIn(coordinates) {
    return () => coordinates.shift();
  }

  function part2(file) {
    console.time('aoc19p2');
    const input = readLines(file)[0].split(',').map(Number);
    const spacecraftSize = 100;
    let previousX = 0;
    let y = spacecraftSize;
    do {
      let x = previousX;
      while(true) {
        if (new IntCodeComputer(input, [], 1, () => {}, trackIn([x, y])).run().shift() === 1) {
          previousX = x;
          break;
        } else {
          x++;
        }
      }

      if(new IntCodeComputer(input, [], 1, () => {}, trackIn( [x + (spacecraftSize - 1), y - (spacecraftSize - 1)])).run().shift() === 1) {
        console.timeEnd('aoc19p2');
        return x * 10000 + y - (spacecraftSize - 1);
      }
      y++;
    }while(true)
  }

  console.log(`Part #1: ${part1('input/aoc19.txt')}`);
  console.log(`Part #2: ${part2('input/aoc19.txt')}`);

  module.exports = {
    part1, part2
  };