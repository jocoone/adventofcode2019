const { readLines } = require('../utils/readandwrite');
const readlineSync = require('readline-sync');
const IntCodeComputer = require('../common/icc');

function print(value) {
  console.log(value.map(x => String.fromCharCode(x)).join(''));
}

function part1(file) {
    console.time('aoc25p1');
    const program = readLines(file)[0].split(',').map(Number);
    const instructions = [];

    let res;
    function output(result) {
      res = [...result];
      result = [];
    }

    function input(inp) {
      if (inp.length === 0) {
        print(res);
        const move = readlineSync.question('');
        const x = [...move.split('').map(x => x.charCodeAt(0)), 10];
        instructions.push(...x)
      }
      return inp.shift();
    }

    const droid = new IntCodeComputer(program, instructions, 0, output, input)
    droid.run();
    print(res);
    console.timeEnd('aoc25p1');
    return 0;
  }


  function part2(file) {
    console.time('aoc25p2');  
    const program = readLines(file)[0].split(',').map(Number);
  
    console.timeEnd('aoc25p2');
    return 0;
  }

  console.log(`Part #1: ${part1('input/aoc25.txt')}`);
  console.log(`Part #2: ${part2('input/aoc25.txt')}`);
  
  module.exports = {
    part1, part2
  };