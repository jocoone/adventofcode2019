const { readLines } = require('../utils/readandwrite');

class Moon {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xVel = 0;
    this.yVel = 0;
    this.zVel = 0;
  }

  applyGravity(moon) {
    if (this.x > moon.x) {
      moon.xVel += 1;
      this.xVel -= 1;
    }
    if (this.y > moon.y) {
      moon.yVel += 1;
      this.yVel -= 1;
    }
    if (this.z > moon.z) {
      moon.zVel += 1;
      this.zVel -= 1;
    }
  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;
    this.z += this.zVel;
  }

  getPotentialEnergy() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  getKineticEnergy() {
    return Math.abs(this.xVel) + Math.abs(this.yVel) + Math.abs(this.zVel);
  }

  getEnergy() {
    return this.getPotentialEnergy() * this.getKineticEnergy();
  }

  simple() {
    return `${this.x} ${this.y} ${this.z}`// + ` ${this.xVel} ${this.yVel} ${this.zVel}`;
  }
}


function part1(file, steps) {
  console.time('aoc11p1');
  const reg = /x=(-?\d*), y=(-?\d*), z=(-?\d*)/;
  const moons = readLines(file)
    .map(x => reg.exec(x))
    .map((x) => new Moon(Number(x[1]), Number(x[2]), Number(x[3])));

  for(let time = 0; time < steps; time++) {
    moons.forEach(moon => {
      moons.forEach(m => {
        moon.applyGravity(m);
      });
    });
    moons.forEach(moon => moon.move());
  }

  console.timeEnd('aoc11p1');
  return moons.reduce((tot, moon) => tot + moon.getEnergy(), 0);
}

function part2(file) {
  console.time('aoc11p2');
  const reg = /x=(-?\d*), y=(-?\d*), z=(-?\d*)/;
  const moons = readLines(file)
    .map(x => reg.exec(x))
    .map((x) => new Moon(Number(x[1]), Number(x[2]), Number(x[3])));


  let time = 0;
  let pos = [];
  while (true) {
    time++;
    moons.forEach(moon => {
      moons.forEach(m => {
        moon.applyGravity(m);
      });
    });
    moons.forEach(moon => moon.move());
    
    if (time % 10000000 === 0) {
      console.log(time);
    }
    if (moons.reduce((tot, moon) => tot + moon.getKineticEnergy(), 0) === 0) {
      
      break;
    }
  }
  console.log(moons);

  console.timeEnd('aoc11p2');
  return time * 2;
}

const result1 = part1('input/aoc12.txt', 1000);
const result2 = part2('input/aoc12test.txt');

console.log(`Part #1: Total energy = ${result1}`);
console.log(`Part #2: Steps to be initial = ${result2}`);

module.exports = {
  part1, part2
};