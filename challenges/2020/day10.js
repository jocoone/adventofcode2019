const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const x = logTime('Parse', () => readLines('input/2020/aoc10.txt').map(parse));

function parse(x) {
  return Number(x);
}

function getAdapters(x) {
  const deviceJoltage = Math.max(...x) + 3;
  const adapters = [0, ...x, deviceJoltage];
  adapters.sort((a, b) => a - b);
  return adapters;
}

function solveA(x) {
  const adapters = getAdapters(x);
  const diffs = adapters.map((joltage, i) =>
    adapters[i + 1] ? adapters[i + 1] - joltage : 0
  );

  return (
    diffs.filter((i) => i === 1).length * diffs.filter((i) => i === 3).length
  );
}

const cache = {};

function findPath(adapters, add, difference) {
  if (adapters.length === 0) {
    return 0;
  }
  if (adapters.length === 1) {
    return 1;
  }
  const validAdapters = adapters.filter(
    (ad) => ad - add <= difference && ad - add > 0
  );
  if (validAdapters.length < 1) {
    return 1;
  }
  return validAdapters
    .map((x) => {
      if (cache[x]) {
        return cache[x];
      }
      const res = findPath(
        adapters.filter((ad) => ad !== x),
        x,
        difference
      );
      cache[x] = res;
      return res;
    })
    .reduce((acc, x) => acc + x);
}

function solveB(x) {
  const adapters = getAdapters(x);
  return findPath(adapters.slice(1), adapters[0], 3);
}

logTime('A', () => solveA(x));
logTime('B', () => solveB(x));
