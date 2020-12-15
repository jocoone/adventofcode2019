const { readLines } = require('../utils/readandwrite');
const IntCodeRunner = require('../common/icc');

function run() {
  console.time('aoc5');

  const lines = readLines('input/aoc5.txt');
  const program = lines[0].split(',').map(Number);
  console.log(`Part #1: ${new IntCodeRunner(program, [], false).run(1)}`);
  console.log(`Part #2: ${new IntCodeRunner(program, []).run(5)}`);
  console.timeEnd('aoc5');
}



