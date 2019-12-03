const { readLines } = require('../utils/readandwrite');
const { intersectionWith, uniqWith, uniq, isEqual, min, find } = require('lodash');

console.time('aoc3');

const lines = readLines('input/aoc3.txt');
const wire1 = lines[0].split(',');
const wire2 = lines[1].split(',');

function doSteps(instruction, startX, startY) {
  const direction = instruction[0];
  const amount = parseInt(instruction.replace(direction, ''));
  const positions = [];
  if (direction === 'R') {
    for (let x = startX; x < startX + amount; x++) {
      positions.push(`${x}:${startY}`);
    }
    return { positions, x: startX + amount, y: startY}
  }
  if (direction === 'L') {

    for (let x = startX; x > startX - amount; x--) {
      positions.push(`${x}:${startY}`);
    }
    return { positions, x: startX - amount, y: startY }
  }
  if (direction === 'U') {
    for (let y = startY; y > startY - amount; y--) {
      positions.push(`${startX}:${y}`);
    }
    return { positions, x: startX, y: startY - amount }
  }
  if (direction === 'D') {
    for (let y = startY; y < startY + amount; y++) {
      positions.push(`${startX}:${y}`);
    }
    return { positions, x: startX, y: startY + amount}
  }
}

function walk(wire, checkWire) {
  let startX = 0;
  let startY = 0;
  const positions = [];
  console.log('Steps in wire: ' + wire.length);
  for (let i = 0; i < wire.length; i++) {
    const instruction = wire[i];
    const direction = instruction[0];
    const amount = parseInt(instruction.replace(direction, ''));
    if (direction === 'R') {
      for (let x = startX; x < startX + amount; x++) {
        if (checkWire.includes(`${x}:${startY}`) ) {
          positions.push(`${x}:${startY}`)
        }
      }
      startX = startX + amount;
    }
    if (direction === 'L') {
      for (let x = startX; x > startX - amount; x--) {
        if (checkWire.includes(`${x}:${startY}`) ) {
          positions.push(`${x}:${startY}`)
        }
      }
      startX = startX - amount;
    }
    if (direction === 'U') {
      for (let y = startY; y > startY - amount; y--) {
        if (checkWire.includes(`${startX}:${y}`) ) {
          positions.push(`${startX}:${y}`)
        }
      }
      startY = startY - amount;

    }
    if (direction === 'D') {
      for (let y = startY; y < startY + amount; y++) {
        if (checkWire.includes(`${startX}:${y}`)) {
          positions.push(`${startX}:${y}`)
        }
      }
      startY = startY + amount;
    }
  }
  console.log('wire created');
  return positions;
}

function walkWire(wire, xx, yy) {
  for (let i = 0; i < wire.length; i++) {
    const s = wire[i].split(':').map(x => parseInt(x));
    if (s[0] === xx && s[1] === yy) {
      return i;
    }
  }
  console.log('willy');
  return 0;
}

function createWire(wire) {
  let x = 0;
  let y = 0;
  const positions = [];
  for (let i = 0; i < wire.length; i++) {
    const instruction = wire[i];
    const result = doSteps(instruction, x, y);
    x = result.x;
    y = result.y;
    positions.push(...result.positions);
  }
  console.log('wire created');
  return positions;
}

function getDistance(x1, x2, y1, y2) {
  return Math.abs(Math.abs(x1 - x2) + Math.abs(y1 - y2));
}

function getSmallestDistance(intersections, x, y) {
  const distances = intersections
    .map(i => {
      const s = i.split(':').map(x => parseInt(x));
      return { x: s[0], y: s[1]};
    })
    .map((intersection) => getDistance(intersection.x, x, intersection.y, y)).filter(x => x !== 0);

  return min(distances);
}

function calculateDistanceToPoint(point, wire) {
  const s = point.split(':').map(x => parseInt(x));
  return walkWire(wire, s[0], s[1]);
}

function getSmallestDelay(intersections, w1, w2) {
  const sums = [];
  intersections.filter(x => x!== '0:0').forEach(intersection => {
    const w1Distance = calculateDistanceToPoint(intersection, w1);
    const w2Distance = calculateDistanceToPoint(intersection, w2);
    sums.push(w1Distance + w2Distance);
  });

  return min(sums);
}

console.timeLog('aoc3', 'Creating wire 1')
const w1 = createWire(wire1);
console.timeLog('aoc3', 'Creating wire 2')
const w2 = createWire(wire2);
const intersections = walk(wire2, w1);

// console.log(`Smallest distance = ${getSmallestDistance(intersections, 0, 0)}`);
console.log(`Smallest combined steps = ${getSmallestDelay(intersections, w1, w2)}`);

console.timeEnd('aoc3');