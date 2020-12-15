const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => readLines('input/2020/aoc14.txt'));

function parse(x) {}

function calculateResult(mask, value, memory) {
  const result = new Array(36).fill('0');
  for (let i = 0; i < result.length; i++) {
    if (mask[i] === 'X') {
      result[i] = value[i];
    } else {
      result[i] = mask[i];
    }
  }
  return {
    memory: [memory],
    value: parseInt(result.join(''), 2),
  };
}

function changeAddressResult(mask, value, memory) {
  const result = new Array(36).fill('0');
  let memories = [];
  const mem = memory.toString(2).padStart(36, '0');
  for (let i = 0; i < mem.length; i++) {
    if (mask[i] === '0') {
      result[i] = mem[i];
    } else {
      result[i] = mask[i];
    }
  }
  const address = result.join('');
  const numberOfPossibilities = Math.pow(
    2,
    address.length - address.replace(/X/g, '').length
  );
  if (numberOfPossibilities === 0) {
    memories.push(parseInt(address, 2));
  } else {
    const possibilities = [];
    for (let i = 0; i < numberOfPossibilities; i++) {
      possibilities.push(
        i
          .toString(2)
          .padStart(address.length - address.replace(/X/g, '').length, '0')
      );
    }
    possibilities.forEach((pos) => {
      let addr = address;
      for (let i = 0; i < pos.length; i++) {
        const val = pos[i];
        addr = addr.replace('X', val);
      }
      memories.push(parseInt(addr, 2));
    });
  }
  return {
    memory: memories,
    value: parseInt(value, 2),
  };
}

function getSum(program, calculate) {
  let mask;
  let mem = {};
  program.forEach((line) => {
    if (line.includes('mask')) {
      mask = line.replace('mask = ', '');
    } else {
      const split = line.split(' = ');
      const memory = Number(split[0].replace('mem[', '').replace(']', ''));
      const value = Number(split[1]).toString(2).padStart(36, '0');
      let result = calculate(mask, value, memory);
      result.memory.forEach((m) => (mem[m] = result.value));
    }
  });
  return Object.values(mem).reduce((acc, x) => acc + x, 0);
}

function solveA(program) {
  return getSum(program, calculateResult);
}

function solveB(program) {
  return getSum(program, changeAddressResult);
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
