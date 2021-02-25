const { drop } = require('lodash');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => parse(readLines('input/2020/aoc25.txt')));

function parse(x) {
  return [Number(x[0]), Number(x[1])];
}

function encrypt(subject, loopSize) {
  let result = 1;
  for (let i = 0; i < loopSize; i++) {
    result = (result * subject) % 20201227;
  }
  return result;
}

function solveA([cardPublicKey, doorPublicKey]) {
  let cardLoopSize = 0;
  let result = 1;

  while (result != cardPublicKey) {
    result = (result * 7) % 20201227;
    cardLoopSize++;
  }
  return encrypt(doorPublicKey, cardLoopSize);
}

logTime('A', () => solveA(i));
