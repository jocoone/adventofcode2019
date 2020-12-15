const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const numbers = readLines('input/2020/aoc1.txt').map((x) => Number(x));

function findSumOf2020(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === 2020) {
        return numbers[i] * numbers[j];
      }
    }
  }

  return 0;
}

function findSumOf2020B(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      for (let x = 0; x < numbers.length; x++) {
        if (numbers[i] + numbers[j] + numbers[x] === 2020) {
          return numbers[i] * numbers[j] * numbers[x];
        }
      }
    }
  }

  return 0;
}

logTime('A', () => findSumOf2020(numbers));
logTime('B', () => findSumOf2020B(numbers));
