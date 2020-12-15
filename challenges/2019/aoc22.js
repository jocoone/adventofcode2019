const { readLines } = require('../utils/readandwrite');

function newStack2(deckLength, currentPosition) {
  return deckLength - 1 - currentPosition;
}

function newStack3(deckLength, offset, increment) {
  return [(deckLength + deckLength - offset - 1) % deckLength, (deckLength - increment) % deckLength];
}

function cut2(deckLength, currentPosition, n) {
  return (currentPosition - n) % deckLength;
}

function cut3(deckLength, offset, increment, n) {
  return [ ((offset+ n) %deckLength + deckLength )% deckLength, increment ];
}

function increment2(deckLength, currentPosition, n) {
  return (currentPosition * n) % deckLength;
}

function increment3(deckLength, offset, increment, n) {
  return [  modDiv(offset, n, deckLength), modDiv(increment, n, deckLength) ];
}

function gcdExtended(a, b) {
  let x = 0, y = 1, u = 1, v = 0;
  while (a !== 0) {
    let q = Math.floor(b / a);
    [x, y, u, v] = [u, v, x - u * q, y - v * q];
    [a, b] = [b % a, a];
  }
  return [b, x, y];
}

function modInverse(a, m) {
  const [g, x] = gcdExtended(a, m);
  if (g !== 1) throw('Bad mod inverse')
  return (x + m) % m;
}

function modDiv(a, b, m) {
  return Number(BigInt(a) * BigInt(modInverse(b, m)) % BigInt(m));
}

function mulMod(a,b,m) {
  return Number(BigInt(a) * BigInt(b) % BigInt(m))
}

function parseInput(input) {
  return input.map(x => {
    if (x.indexOf('cut') >= 0) {
      return { move: 'cut', n: Number(x.split(' ')[1]) }
    }else if (x.indexOf('increment') >= 0) {
      return { move: 'increment', n: Number(x.split('increment ')[1]) };
    } else {
      return { move: 'newstack' }
    }
  });
}

const shuffles = {
  'cut': cut2,
  'increment': increment2,
  'newstack': newStack2
}

const shuffles2 = {
  'cut': cut3,
  'increment': increment3,
  'newstack': newStack3
}

function part1(file) {
    console.time('aoc22p1');
    const input = parseInput(readLines(file));

    let currentPosition = 2019
    input.forEach(({move, n}) => {
      currentPosition = shuffles[move](10007, currentPosition, n);
    });

    console.timeEnd('aoc22p1');
    return currentPosition;
  }

  function part2(file) {
    console.time('aoc22p2');
    const input = parseInput(readLines(file));
    const decklength = 119315717514047;
    let [offset, increment] = [0, 1];
    input.forEach(({ move, n }) => {
      [offset, increment] = shuffles2[move](decklength, offset, increment, n);
    });

    let result = 2020;
    let rep = 101741582076661;
    while(rep) {
      if (rep % 2) result = (mulMod(result, increment, decklength) + offset) % decklength;
      [offset,increment] = [((mulMod(offset, increment, decklength)) + offset) % decklength, mulMod(increment,increment, decklength)];
      rep = Math.floor(rep / 2);
    }

    console.timeEnd('aoc22p2');
    return result;
  }

  console.log(`Part #1: ${part1('input/aoc22.txt')}`);
  console.log(`Part #2: ${part2('input/aoc22.txt')}`);
  
  module.exports = {
    part1, part2
  };