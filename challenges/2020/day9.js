const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const x = logTime('Parse', () => readLines('input/2020/aoc9.txt').map(parse));

function parse(x) {
  return Number(x);
}

function isValid(num, preamble) {
  for (let i = 0; i < preamble.length; i++) {
    for (let j = i + 1; j < preamble.length; j++) {
      if (preamble[i] != preamble[j]) {
        if (preamble[i] + preamble[j] == num) {
          return true;
        }
      }
    }
  }
  return false;
}

function solveA(nums, preambleLength) {
  let invalid;
  let count = 0;
  do {
    const preamble = nums.slice(count, count + preambleLength);
    const num = nums[count + preambleLength];
    if (!isValid(num, preamble)) {
      return num;
    }
    count++;
  } while (!invalid);
}

function solveB(x, invalidNum) {
  let startIndex = 0;
  do {
    for (let i = startIndex + 2; i < x.length; i++) {
      const nums = x.slice(startIndex, i + 1);
      const reduce = nums.reduce((acc, x) => acc + x);
      if (reduce > invalidNum) {
        break;
      }
      if (reduce == invalidNum) {
        return Math.min(...nums) + Math.max(...nums);
      }
    }
    startIndex++;
  } while (true);
}

const invalidNum = logTime('A', () => solveA(x, 25));
logTime('B', () => solveB(x, invalidNum));
