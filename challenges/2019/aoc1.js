const { readLines } = require('../utils/readandwrite');

const lines = readLines('input/aoc1.txt');

const fuel = calculateFuel(lines);

function determineFuel(input) {
  return Math.floor(input / 3) - 2;
}

function calculateFuel(lines, operator = x => x) {
  return lines.map(x => parseInt(x))
  .map(determineFuel)
  .map(operator)
  .reduce((x, y) => x + y);
}

function calculateAdditionalFuel(fuel) {
  const additionalFuel = determineFuel(fuel);
  if (additionalFuel < 0) {
    return fuel;
  }
  return calculateAdditionalFuel(additionalFuel) + fuel;
}

const totalFuel = calculateFuel(lines, calculateAdditionalFuel);

console.log(`#1: Fuel required is: ${fuel}`);
console.log(`#2: Fuel + additional Fuel required is: ${totalFuel}`);