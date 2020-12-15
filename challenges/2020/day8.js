const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const instructions = logTime('Parse', () =>
  readLines('input/2020/aoc8.txt').map(parse)
);

function parse(instruction) {
  const split = instruction.split(' ');
  return {
    instruction: split[0],
    value: Number(split[1]),
    executions: 0,
  };
}

function getSingleRunAccumulator(instructions, runthrough) {
  let acc = 0;
  let index = 0;
  let executing = instructions[index];

  do {
    if (executing.instruction === 'acc') {
      acc += executing.value;
      index++;
    } else if (executing.instruction === 'jmp') {
      index += executing.value;
    } else {
      index++;
    }
    executing.executions = executing.executions + 1;
    executing = instructions[index];

    if (runthrough) {
      if (!executing) {
        return acc;
      }
      if (executing.executions === 1) {
        return undefined;
      }
    } else {
      if (executing.executions === 1) {
        return acc;
      }
    }
  } while (executing);

  return acc;
}

function changeInstruction(instructions, start) {
  let changed = false;
  return instructions.map((instruction, index) => {
    if (!changed && index >= start) {
      if (instruction.instruction === 'jmp') {
        changed = true;
        return {
          instruction: 'nop',
          value: instruction.value,
          executions: 0,
        };
      } else if (instruction.instruction === 'nop' && instruction.value !== 0) {
        changed = true;
        return {
          instruction: 'jmp',
          value: instruction.value,
          executions: 0,
        };
      }
    }
    return {
      ...instruction,
      executions: 0,
    };
  });
}

function fixBootcode(inx) {
  let start = 0;
  let acc = 0;
  do {
    const instructions = changeInstruction(inx, start);
    acc = getSingleRunAccumulator(instructions, true);

    start++;
  } while (start < inx.length && !acc);
  return acc;
}

logTime('A', () => getSingleRunAccumulator(instructions));
logTime('B', () => fixBootcode(instructions));
