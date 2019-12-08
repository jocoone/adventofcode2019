const { readLines } = require('../utils/readandwrite');
const IntCodeRunner = require('./aoc5.js');
const { intersection, uniq } = require('lodash');

function getProgram(input) {
  const lines = readLines(input);
  return lines[0].split(',').map(x => parseInt(x));
}

function part1(input) {
  console.time('aoc7p1');
  const program = getProgram(input);
  const settings = getPhaseSettings(false);
  let result = 0;
  settings.forEach(setting => {
    const a = new IntCodeRunner(program, [setting[0]]).run(0);
    const b = new IntCodeRunner(program, [setting[1]]).run(a);
    const c = new IntCodeRunner(program, [setting[2]]).run(b);
    const d = new IntCodeRunner(program, [setting[3]]).run(c);
    const e = new IntCodeRunner(program, [setting[4]]).run(d);
    if (e > result) {
      result = e;
    }
  });
  console.timeEnd('aoc7p1');
  return result;
}

function part2(input) {
  console.time('aoc7p2');
  const program = getProgram(input);
  const settings = getPhaseSettings(true);
  const thrusterSignals = [];
  settings.forEach(setting => {
    const amplifiers = setting.map(s => new IntCodeRunner([...program], [s]));

    let index = 0;
    let lastOutput = 0;

    while (!amplifiers[4].terminated) {
      const output = amplifiers[index].run(lastOutput);

      if (output !== null) {
        lastOutput = output;
      }

      index = index + 1 === amplifiers.length ? 0 : index + 1;
    }

    thrusterSignals.push(Number(lastOutput));
  });
  console.timeEnd('aoc7p2');
  return thrusterSignals.sort((a, b) => b - a)[0];
}

function getPhaseSettings(loopmode) {
  const result = [];
  const start = loopmode ? 5 : 0;
  for (let i = start; i < start + 5; i++) {
    for (let j = start; j < start + 5; j++) {
      for (let k = start; k < start + 5; k++) {
        for (let l = start; l < start + 5; l++) {
          for (let m = start; m < start + 5; m++) {
            if (uniq([i,j,k,l,m]).length === 5) {
              result.push([i, j, k, l, m]);
            }
          }
        }
      }
    }
  }
  return result;
}

module.exports = {
  part1, part2
};


