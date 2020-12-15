const { min } = require('lodash');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => parse(readLines('input/2020/aoc13.txt')));

function parse(x) {
  return {
    ts: Number(x[0]),
    busses: x[1].split(',').map((x) => (x === 'x' ? x : Number(x))),
  };
}

function solveA(input) {
  let closestDepartures = [];
  const relevantBusses = input.busses.filter((x) => x !== 'x');

  relevantBusses.forEach((bus) => {
    let departure = 0;
    do {
      departure += bus;
    } while (departure <= input.ts);
    closestDepartures.push(departure);
  });
  const minDeparture = Math.min(...closestDepartures);
  const index = closestDepartures.indexOf(minDeparture);
  return relevantBusses[index] * (minDeparture - input.ts);
}

function solveB(input, magicNumber = 0) {
  let [startPoint, ...busses] = input.busses;
  let result = startPoint * Math.floor(magicNumber / startPoint);

  busses.forEach((bus, index) => {
    if (bus !== 'x') {
      while (true) {
        if ((result + index + 1) % bus === 0) {
          startPoint *= bus;
          break;
        }
        result += startPoint;
      }
    }
  });

  return result;
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
