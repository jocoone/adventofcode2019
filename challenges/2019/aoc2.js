const { readLines } = require('../utils/readandwrite');

console.time('aoc2');

const lines = readLines('input/aoc2.txt');
const program = lines[0].split(',').map(x => parseInt(x));
const program1 = prepareProgram(program, 1, 12);

function prepareProgram(p, noun, verb) {
  const result = [...p];
  result[1] = noun;
  result[2] = verb;
  return result;
}

function runProgram(p) {
  const result = [...p];
  for (let i = 0; i < result.length; i+=4) {
    const opcode = result[i];

    if (opcode === 99) {
      break;
    }

    const input1 = result[i + 1];
    const input2 = result[i + 2];
    const output = result[i + 3];

    if(opcode === 1) {
      result[output] = result[input1] + result[input2];
    } else if(opcode === 2) {
      result[output] = result[input1] * result[input2];
    }
  }

  return result;
}

function findNoundAndVerb(p, i) {
  while(true) {
    for (let noun = 0; noun < 100; noun++) {
      for (let verb = 0; verb < 100; verb++) {
        const input = prepareProgram([...p], noun, verb);
        const result = runProgram(input);
        if (result[0] === i) {
          return { noun: noun, verb: verb }
        }
      }
    }
  }
}

const result1 = runProgram(program1);
const result2 = findNoundAndVerb(program, 19690720);

console.log('Value at position 0: ' + result1[0]);
console.log(`Noun: ${result2.noun} and verb: ${result2.verb} produce value: 19690720 resulting in: ${100 * result2.noun + result2.verb}`);

console.timeEnd('aoc2');