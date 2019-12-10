const { readLines } = require('../utils/readandwrite');
const { maxBy, find } = require('lodash');

function countAstroids(astroids) {
  let count = 0;
  for (let y = 0; y < astroids.length; y++) {
    for (let x = 0; x < astroids[y].length; x++) {
      if (astroids[y][x] === '#') {
        count++;
      }
    }
  }
  return count;
}

function test() {
  for (let y = 0; y < astroids.length; y++) {
    for (let x = 0; x < astroids[y].length; x++) {
      if (astroids[y][x] === '#') {
        let blockedAstroids = 0;
        for (let yy = 0; yy < astroids.length; yy++) {
          for (let xx = 0; xx < astroids[yy].length; xx++) {
            if (astroids[yy][xx] === '#' && x !== xx && y !== yy) {
              
            }
          }
        }
      }
    }
  }
}

function part1(file) {
  console.time('aoc10p1');
  const astroids = readLines(file).map(x => x.split(''));
  const numOfAstroids = countAstroids(astroids);
  const astroidsLocations = [];
  for (let y = 0; y < astroids.length; y++) {
    for (let x = 0; x < astroids[y].length; x++) {
      if (astroids[y][x] === '#') {
        astroidsLocations.push({x, y, visible: []});
      }
    }
  }
  astroidsLocations.forEach(astroid => {
    astroidsLocations.forEach(astroid2 => {
      if (astroid.x !== astroid2.x && astroid.y!== astroid2.y) {
        const xSpace = Math.abs(astroid.x - astroid2.x);
        const ySpace = Math.abs(astroid.y - astroid2.y);
        astroidsLocations.forEach(searchingAstroid => {
          if (Math.abs(searchingAstroid.x - astroid2.x) % xSpace === 0 &&
              Math.abs(searchingAstroid.y - astroid2.y) % ySpace === 0 &&
              astroid.x != searchingAstroid.x && astroid.y !== searchingAstroid.y &&
              !find(astroid.visible, {x: searchingAstroid.x, y: searchingAstroid.y})) {
            astroid.visible.push({x: searchingAstroid.x, y: searchingAstroid.y});
          }
        });
      }
    });
  });
  const result = maxBy(astroidsLocations, a => a.visible.length);
  console.timeEnd('aoc10p1');
  return result;
}

function part2(file) {
  console.time('aoc10p2');

  
  console.timeEnd('aoc10p2');
  return result;
}

console.log(part1('input/aoc10test.txt'));

module.exports = {
  part1, part2
};


