const { readLines } = require('../utils/readandwrite');
const { maxBy, find } = require('lodash');

function gcd_two_numbers(x, y) {
   x = Math.abs(x);
   y = Math.abs(y);
   while (y) {
      let t = y;
      y = x % y;
      x = t;
   }
   return x;
}

function getAngle(x1, y1, x2, y2) {
   var angleRadians = (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI;
   if (angleRadians < 0) angleRadians += 360;
   angleRadians -= 90;
   if (angleRadians < 0) angleRadians += 360;
   return angleRadians;
}

function checkLineOfSight(asteroids,x1, y1, x2, y2) {
   if (asteroids[y1][x1] !== "#" || asteroids[y2][x2] !== "#" || y2 === y1 && x2 === x1) return false; // not asteroid or same object
   let dy = y2 - y1;
   let dx = x2 - x1;
   if (dx !== dy || dy !== 0) {
      let gcd = gcd_two_numbers(dy, dx);
      dy /= gcd;
      dx /= gcd;
   }
   let x = x1 + dx;
   let y = y1 + dy;
   while (asteroids[y] && asteroids[y][x]) {
      if (asteroids[y][x] === "#") {
         if (y === y2 && x === x2) {
            return true;
         }
         return false;
      }
      y += dy;
      x += dx;
   }
}

function checkLineOfSight2(asteroids, x1, y1, x2, y2) {
   if (asteroids[y1][x1] !== "#" || asteroids[y2][x2] !== "#" || y2 === y1 && x2 === x1) return false; // not asteroid or same object
   let dy = y2 - y1;
   let dx = x2 - x1;
   if (dx !== dy || dy !== 0) {
      let gcd = gcd_two_numbers(dy, dx);
      dy /= gcd;
      dx /= gcd;
   }
   let x = x1 + dx;
   let y = y1 + dy;
   let ibtcount = 0;
   while (asteroids[y] && asteroids[y][x]) {
      if (asteroids[y][x] === "#") {
         if (y === y2 && x === x2) {
            return ibtcount;
         }
         ibtcount++;
         return false;
      }
      y += dy;
      x += dx;
   }
}

function part1(file) {
  console.time('aoc10p1');
    const asteroids = readLines(file).map(x => x.split(''));
    const original = readLines(file).map(x => x.split(''));
   let maxCount = 0;
   let maxx = 0;
   let maxy = 0;
   for (let y = 0; y < asteroids.length; y++) {
      for (let x = 0; x < asteroids[0].length; x++) {
         let count = 0;
         for (let y2 = 0; y2 < asteroids.length; y2++) {
            for (let x2 = 0; x2 < asteroids[0].length; x2++) {
               count += +checkLineOfSight(asteroids, x, y, x2, y2);
            }
         }
         original[y][x] = count;
         if (count > maxCount) {
            maxCount = count;
            maxx = x;
            maxy = y;
         }
      }
   }
  console.timeEnd('aoc10p1');
  return { maxCount, maxx, maxy };
}

function getGcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function part2(file, { x, y }) {
   console.time('aoc10p2');
   const asteroids = readLines(file).map(x => x.split(''));
   let angles = [];
   for (let yy = 0; yy < asteroids.length; yy++) {
      for (let xx = 0; xx < asteroids[y].length; xx++) {
         let los = checkLineOfSight2(asteroids, x, y, xx, yy);
         if (los === false) continue;
         angles.push({
            angle: getAngle(x, y, xx, yy),
            lineOfSight: los,
            x: xx,
            y: yy
         });
      }
   }
   angles.sort((a, b) => (a.angle - b.angle === 0 ? a.lineOfSight - b.lineOfSight : a.angle - b.angle));
    console.timeEnd('aoc10p2');
   return angles[199].x * 100 + angles[199].y; 
}



const { maxCount, maxx, maxy } = part1('aoc10.txt');
console.log(`${maxCount} asteroids visible from location (x: ${maxx}, y:${maxy})`);
console.log(`#Part2: ${part2('aoc10.txt', { x: maxx, y: maxy })}`);

module.exports = {
  part1, part2
};