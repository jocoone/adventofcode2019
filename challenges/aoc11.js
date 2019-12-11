const { readLines } = require('..utils/readandwrite');
const { uniqBy, find } = require('lodash');
const IntCodeRunner = require('../common/icc');

const RIGHT = 1;
const LEFT = 0;
const DOWN = 2;
const UP = 3;

const ALPHABET = {
  A: ' XX X  XX  XXXXXX  XX  X',
  B: 'XXX X  XXXX XXX X  XXXX ',
  C: ' XX X  XX   X   X  X XX ',
  D: 'XXX X  XX  XX  XX  XXXX ',
  E: 'XXXXX   XXX X   X   XXXX',
  F: 'XXXXX   XXX X   X   X   ',
  G: ' XX X  XX   X XXX  X XXX',
  H: 'X  XX  XXXXXX  XX  XX  X',
  I: '',
  J: 'XXXX   X   X   X   XXXX ',
  K: 'X  XX X XX  X X X X X  X',
  L: 'X   X   X   X   X   XXXX',
  M: '',
  N: '',
  O: ' XX X  XX  XX  XX  X XX ',
  P: 'XXX X  XXXX X   X   X   ',
  Q: '',
  R: 'XXX X  XXXX XX  X X X  X',
  S: ' XX X  XXXX    X   XXXX ',
  T: '',
  U: 'X  XX  XX  XX  XX  X XX ',
  V: '',
  W: '',
  Z: 'XXXX   X  X  X  X   XXXX',
};

class Painter {
  constructor(input, startColor) {
    this.startColor = startColor;
    this.direction = "UP";
    this.program = new IntCodeRunner(input, [], 2);
    this.coordinates = [];
    this.lastX = 0;
    this.lastY = 0;
  }

  movePointer(turn) {
    if (this.direction === "UP") {
      this.direction = turn === LEFT ? "LEFT" : "RIGHT";
    } else if (this.direction === "DOWN") {
      this.direction = turn === LEFT ? "RIGHT" : "LEFT";
    } else if (this.direction === "RIGHT") {
      this.direction = turn === LEFT ? "UP" : "DOWN";
    } else {
      this.direction = turn === LEFT ? "DOWN" : "UP";
    }
    if (this.direction === "UP") {
      this.lastY++;
    } else if (this.direction === "DOWN") {
      this.lastY--;
    } else if (this.direction === "RIGHT") {
      this.lastX++;
    } else {
      this.lastX--;
    }
  }

  draw() {
    do {
      const coordinate = find(this.coordinates, { x: this.lastX, y: this.lastY });
      const result = this.program.run(coordinate ? coordinate.color : this.startColor);
      const [color, turn] = result;
      if (coordinate) {
        coordinate.color = color
      } else {
        this.coordinates.push({x: this.lastX, y: this.lastY, color });
      }
      this.movePointer(turn);
      this.program.clear();
    } while(!this.program.terminated);
  }

  visualise(result) {
    let smallestX = 0;
    let smallestY = 0;
    let largestX = 0;
    let largestY = 0;
    for (let i = 0; i < result.length; i++) {
      const coordinate = result[i];
      if (coordinate.x < smallestX) {
        smallestX = coordinate.x;
      }
      if (coordinate.y < smallestY) {
        smallestY = coordinate.y;
      }
      if (coordinate.x > largestX) {
        largestX = coordinate.x;
      }
      if (coordinate.y > largestY) {
        largestY = coordinate.y;
      }
    }
    let rule = [];
    for (let y = largestY; y > smallestY - 1; y--){
      let row = [];
      for (let x = smallestX + 1; x < largestX; x++) {
        const coordinate = find(result, {x, y});
        if (coordinate && coordinate.color === 1) {
          row.push('X');
        } else {
          row.push(' ');
        }
      }
      rule.push(row);
    }
    return rule;
  }

}

function part1(file) {
  console.time('aoc11p1');
  const input = readLines(file)[0].split(',').map(Number);
  const painter = new Painter(input, 0);

  painter.draw();

  console.timeEnd('aoc11p1');
  return painter.coordinates;
}

function part2(file) {
  console.time('aoc11p2');
  const input = readLines(file)[0].split(',').map(Number);
  const painter = new Painter(input, 1);

  painter.draw();
  const visualisation = painter.visualise(painter.coordinates);
  const letters = [];
  for (let i = 0; i < 8; i++) {
    let letter = '';
    for(let y = 0; y < visualisation.length; y++) {
      for (let x = 0; x < visualisation[y].length; x++) {
        if (x >= letters.length * 5 && x < letters.length * 5 + 4) {
          letter += visualisation[y][x];
        }
      }
    }
    letters.push(letter);
  }

  const sentence = letters.map(letter => {
    const a = Object.keys(ALPHABET);
    for (let i = 0; i < a.length; i++) {
      if (ALPHABET[a[i]] === letter) {
        return a[i];
      }
    }
  }).join('');

  console.timeEnd('aoc11p2');
  return sentence;
}

const coordinates = part1('aoc11.txt');
const text = part2('aoc11.txt');
console.log(`Part #1: Number of visited coordinates: ${uniqBy(coordinates, x => x.x + '-' + x.y).length}`);
console.log(`Part #2: Registration identifier: \n${text}`);

module.exports = {
  part1, part2
};