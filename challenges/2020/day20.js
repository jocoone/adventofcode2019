const { intersection, last, merge } = require('lodash');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const lines = readLines('input/2020/aoc20.txt');

class Tile {
  constructor(id) {
    this.id = id;
    this.data = [];
    this.edges = [];
  }

  addData(line) {
    this.data.push(line);
  }

  isCorner(tiles) {
    return this.matches(tiles) === 2;
  }

  removeEdges() {
    this.data.splice(0, 1);
    this.data.splice(this.data.length - 1, 1);
    this.data = this.data.map((x) => x.substring(1, x.length - 1));
  }

  matches(tiles) {
    const intersections = [];
    tiles.forEach((tile) => {
      if (this.id !== tile.id) {
        intersections.push(intersection(this.edges, tile.edges).length);
      }
    });
    return intersections.filter((x) => x === 2).length;
  }

  isMatch(tile) {
    return intersection(this.edges, tile.edges).length === 2;
  }

  finish() {
    this.edges.push(...this.getDataValue(this.data[0]));
    this.edges.push(...this.getDataValue(this.data[this.data.length - 1]));
    let x = [];
    for (let i = 0; i < this.data.length; i++) {
      x.push(this.data[i][0]);
    }
    this.edges.push(...this.getDataValue(x.join('')));
    x = [];
    for (let i = 0; i < this.data.length; i++) {
      x.push(this.data[i][this.data.length - 1]);
    }
    this.edges.push(...this.getDataValue(x.join('')));
  }

  getDataValue(data) {
    const value = data.split('').map((x) => (x === '#' ? '1' : '0'));
    return [parseInt(value.join(''), 2), parseInt(value.reverse().join(''), 2)];
  }
}

const i = logTime('Parse', () => parse(lines));

class Image {
  constructor(data) {
    this.image = data;
    this.width = data.length;
  }

  findMonsters() {
    let numMonsters = 0;
    const positionIterator = this.getNextPosition();
    while (numMonsters === 0 && positionIterator.next().value === true) {
      for (let y = 1; y < this.image.length - 1; y++) {
        for (let x = 0; x < this.image[y].length - 19; x++) {
          const isMonster =
            this.image[y][x] === '#' &&
            this.image[y + 1][x + 1] === '#' &&
            this.image[y + 1][x + 4] === '#' &&
            this.image[y][x + 5] === '#' &&
            this.image[y][x + 6] === '#' &&
            this.image[y + 1][x + 7] === '#' &&
            this.image[y + 1][x + 10] === '#' &&
            this.image[y][x + 11] === '#' &&
            this.image[y][x + 12] === '#' &&
            this.image[y + 1][x + 13] === '#' &&
            this.image[y + 1][x + 16] === '#' &&
            this.image[y][x + 17] === '#' &&
            this.image[y][x + 18] === '#' &&
            this.image[y][x + 19] === '#' &&
            this.image[y - 1][x + 18];
          if (isMonster) {
            numMonsters++;
            this.image[y][x] = 'o';
            this.image[y + 1][x + 1] = 'o';
            this.image[y + 1][x + 4] = 'o';
            this.image[y][x + 5] = 'o';
            this.image[y][x + 6] = 'o';
            this.image[y + 1][x + 7] = 'o';
            this.image[y + 1][x + 10] = 'o';
            this.image[y][x + 11] = 'o';
            this.image[y][x + 12] = 'o';
            this.image[y + 1][x + 13] = 'o';
            this.image[y + 1][x + 16] = 'o';
            this.image[y][x + 17] = 'o';
            this.image[y][x + 18] = 'o';
            this.image[y][x + 19] = 'o';
            this.image[y - 1][x + 18] = 'o';
          }
        }
      }
    }
    return numMonsters;
  }

  flipVertically() {
    for (let i = 0; i < this.image.length; i++) {
      this.image[i] = this.image[i].reverse();
    }
  }

  rotate90clockwise() {
    const imageSize = this.image.length / 2;
    const maxY = this.image.length - 1;
    for (let x = 0; x < imageSize; x++) {
      for (let y = x; y < maxY - x; y++) {
        const temp = this.image[x][y];
        this.image[x][y] = this.image[maxY - y][x];
        this.image[maxY - y][x] = this.image[maxY - x][maxY - y];
        this.image[maxY - x][maxY - y] = this.image[y][maxY - x];
        this.image[y][maxY - x] = temp;
      }
    }
  }

  *getNextPosition() {
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    this.flipVertically();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    this.flipVertically();
    this.rotate90clockwise();
    this.flipVertically();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    yield true;
    this.rotate90clockwise();
    yield true;
    yield false;
  }
}

function parse(x) {
  const tiles = [];
  let tile;
  x.forEach((line) => {
    if (line.includes('Tile')) {
      tile = new Tile(Number(line.replace('Tile ', '').replace(':', '')));
    } else if (!line) {
      tile.finish();
      tiles.push(tile);
      return;
    } else {
      tile.addData(line);
    }
  });
  tile.finish();
  tiles.push(tile);
  return tiles;
}

function mergeTiles(puzzle, tiles) {
  let result = '';

  for (let y = 0; y < puzzle.length; y++) {
    for (let x = 0; x < 8; x++) {
      puzzle[y].forEach((p) => {
        const tile = tiles.find(({ id }) => id === p);
        result += tile.data[x];
      });
      result += '\n';
    }
  }

  return result;
}

function findPiece(id, tiles) {
  const tile = tiles.find((t) => t.id === id);
  return tiles.filter((t) => tile.isMatch(t)).map((t) => t.id);
}

function printPuzzle(puzzle) {
  console.log(
    `${puzzle
      .map((row) => row.map((x) => (x ? x : '????')).join(' '))
      .join('\n')}
    
    `
  );
}

function solveA(tiles) {
  const filter = tiles
    .filter((tile) => tile.isCorner(tiles))
    .map((tile) => tile.id);
  if (filter.length !== 4) {
    console.log(filter);
    throw new Error('Missing some corners');
  }
  return filter.reduce((acc, x) => acc * x, 1);
}

function solveB(tiles) {
  const size = Math.sqrt(tiles.length);
  const puzzle = [];
  for (let i = 0; i < size; i++) {
    const line = [];
    for (let j = 0; j < size; j++) {
      line.push(0);
    }
    puzzle.push(line);
  }
  const pieces = tiles.reduce(
    (acc, x) => {
      const matches = x.matches(tiles);
      acc[matches].push(x.id);
      return acc;
    },
    { 2: [], 3: [], 4: [] }
  );
  const foundPieces = [pieces[2][0]];
  let lastPiece = foundPieces[0];
  puzzle[0][0] = lastPiece;
  const matchingPieces = findPiece(lastPiece, tiles);
  lastPiece = matchingPieces[0];
  puzzle[0][1] = matchingPieces[0];
  foundPieces.push(matchingPieces[0]);
  for (let i = 2; i < size; i++) {
    //TOP
    const p = findPiece(lastPiece, tiles).filter(
      (id) => pieces[3].includes(id) && !foundPieces.includes(id)
    );
    if (p.length > 1) {
      console.log(i, p);
      console.log(puzzle[0]);
      throw new Error('AAAAAAAHHHHH');
    }
    if (p.length === 1) {
      puzzle[0][i] = p[0];
      lastPiece = p[0];
      foundPieces.push(p[0]);
    } else {
      const pp = findPiece(lastPiece, tiles).filter(
        (id) => pieces[2].includes(id) && !foundPieces.includes(id)
      );
      puzzle[0][i] = pp[0];
      lastPiece = pp[0];
      foundPieces.push(pp[0]);
    }
  }
  for (let i = 1; i < size; i++) {
    // RIGHT
    const p = findPiece(lastPiece, tiles).filter(
      (id) => pieces[3].includes(id) && !foundPieces.includes(id)
    );
    if (p.length > 1) {
      console.log(i, p);
      console.log(puzzle[0]);
      throw new Error('AAAAAAAHHHHH');
    }
    if (p.length === 1) {
      puzzle[i][size - 1] = p[0];
      lastPiece = p[0];
      foundPieces.push(p[0]);
    } else {
      const pp = findPiece(lastPiece, tiles).filter(
        (id) => pieces[2].includes(id) && !foundPieces.includes(id)
      );
      puzzle[i][size - 1] = pp[0];
      lastPiece = pp[0];
      foundPieces.push(pp[0]);
    }
  }
  for (let i = size - 2; i >= 0; i--) {
    // DOWN
    const p = findPiece(lastPiece, tiles).filter(
      (id) => pieces[3].includes(id) && !foundPieces.includes(id)
    );
    if (p.length > 1) {
      console.log(i, p);
      console.log(puzzle[0]);
      throw new Error('AAAAAAAHHHHH');
    }
    if (p.length === 1) {
      puzzle[size - 1][i] = p[0];
      lastPiece = p[0];
      foundPieces.push(p[0]);
    } else {
      const pp = findPiece(lastPiece, tiles).filter(
        (id) => pieces[2].includes(id) && !foundPieces.includes(id)
      );
      puzzle[size - 1][i] = pp[0];
      lastPiece = pp[0];
      foundPieces.push(pp[0]);
    }
  }
  for (let i = size - 2; i >= 0; i--) {
    // LEFT
    const p = findPiece(lastPiece, tiles).filter(
      (id) => pieces[3].includes(id) && !foundPieces.includes(id)
    );
    if (p.length > 1) {
      console.log(i, p);
      console.log(puzzle[0]);
      throw new Error('AAAAAAAHHHHH');
    }
    if (p.length === 1) {
      puzzle[i][0] = p[0];
      lastPiece = p[0];
      foundPieces.push(p[0]);
    }
  }
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const p = tiles
        .filter((t) => pieces[4].includes(t.id))
        .filter((tile) => {
          const tile1 = tiles.find((t) => t.id === puzzle[y][x - 1]);
          const tile2 = tiles.find((t) => t.id === puzzle[y - 1][x]);
          return (
            tile.isMatch(tile1) &&
            tile.isMatch(tile2) &&
            !foundPieces.includes(tile.id)
          );
        })
        .map((t) => t.id);
      if (p.length > 1) {
        console.log(p);
        printPuzzle(puzzle);
        throw new Error('AAAAAAAHHHHH');
      }
      puzzle[y][x] = p[0];
      foundPieces.push(p[0]);
    }
  }
  printPuzzle(puzzle);

  tiles.forEach((tile) => tile.removeEdges());
  const merged = mergeTiles(puzzle, tiles);
  const image = new Image(merged.split('\n').map((x) => x.split('')));

  image.findMonsters();
  return image.image
    .map((x) => x.join(''))
    .join('')
    .split('')
    .filter((x) => x === '#').length;
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
