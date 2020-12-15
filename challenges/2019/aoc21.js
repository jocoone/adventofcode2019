const { readLines } = require('../utils/readandwrite');
const IntCodeComputer = require('../common/icc');

function transformInstructions(instructions) {
  return instructions
    .map(x => x.split(''))
    .reduce((acc, x) => acc.concat([...x, '\n']), [])
    .map(x => x.charCodeAt(0));
}

function part1(file) {
    console.time('aoc21p1');
    const program = readLines(file)[0].split(',').map(Number);
    
    const instructions = [
      'NOT A J',
      'NOT B T',
      'OR T J',
      'NOT C T',
      'OR T J',
      'AND D J',
      'WALK'
    ]

    function input(instructions) {
      const transformedInstructions = transformInstructions(instructions);
      return () => transformedInstructions.shift();
    }

    let res;
    function output(result, value) {
      res = value;
    }

    const droid = new IntCodeComputer(program, [], 0, output, input(instructions));
    droid.run();

    console.timeEnd('aoc21p1');
    return res;
  }

  function part2(file) {
    console.time('aoc21p2');
    const program = readLines(file)[0].split(',').map(Number);
    const instructions = [
      'NOT I T',
      'NOT T J',
      'OR F J',
      'AND E J',
      'OR H J',
      'AND D J',
      'NOT A T',
      'NOT T T',
      'AND B T',
      'AND C T',
      'NOT T T',
      'AND T J',
      'RUN'
    ]

    function input(instructions) {
      const transformedInstructions = transformInstructions(instructions);
      return () => transformedInstructions.shift();
    }

    let res;
    function output(result, value) {
      console.log(result.map(x => String.fromCharCode(x)).join(''));
      res = value;
    }

    const droid = new IntCodeComputer(program, [], 0, output, input(instructions));
    droid.run();

    return res;
  }

  console.log(`Part #1: ${part1('input/aoc21.txt')}`);
  console.log(`Part #2: ${part2('input/aoc21.txt')}`);
  
  module.exports = {
    part1, part2
  };