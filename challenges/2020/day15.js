const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => parse(readLines('input/2020/aoc15.txt')));

function parse(x) {
  return x[0].split(',');
}

function calculateLastSpoken(numbers, rounds) {
  const nums = new Array(rounds);
  let lastNumberSpoken = numbers[numbers.length - 1];
  numbers.forEach((num, i) => (nums[num] = i + 1));
  for (let round = numbers.length; round < rounds; round++) {
    const nextNumber = nums[lastNumberSpoken]
      ? round - nums[lastNumberSpoken]
      : 0;
    nums[lastNumberSpoken] = round;
    lastNumberSpoken = nextNumber;
  }
  return lastNumberSpoken;
}

function solveA(numbers) {
  return calculateLastSpoken(numbers, 2020);
}

function solveB(numbers) {
  return calculateLastSpoken(numbers, 30000000);
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
