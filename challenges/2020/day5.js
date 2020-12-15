const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const rows = 128;
const columns = 127;

const COLUMNS = {
  RLR: 5,
  RLL: 4,
  RRL: 6,
  RRR: 7,
  LRL: 2,
  LRR: 3,
  LLR: 1,
  LLL: 0,
};

class BoardingPass {
  constructor(boardingPass) {
    this.row = boardingPass.substring(0, 7);
    this.column = boardingPass.substring(7);
  }

  getRow() {
    let min = 0,
      max = 127;
    for (let i = 0; i < this.row.length - 1; i++) {
      if (this.row[i] === 'F') {
        max = max - Math.ceil((max - min) / 2);
      } else if (this.row[i] === 'B') {
        min = min + Math.ceil((max - min) / 2);
      }
    }
    return this.row[this.row.length - 1] === 'F' ? min : max;
  }

  getColumn() {
    return COLUMNS[this.column];
  }

  getColumnAlt() {
    let min = 0,
      max = 7;
    for (let i = 0; i < this.column.length - 1; i++) {
      if (this.column[i] === 'L') {
        max = max - Math.ceil((max - min) / 2);
      } else if (this.column[i] === 'R') {
        min = min + Math.ceil((max - min) / 2);
      }
    }
    return this.column[2] === 'L' ? min : max;
  }
}

const boardingPasses = logTime('Parse', () =>
  readLines('input/2020/aoc5.txt').map(parse)
);

function parse(boardingPass) {
  return new BoardingPass(boardingPass);
}

function getSeatIds(bps) {
  return bps.map((bp) => bp.getRow() * 8 + bp.getColumn());
}

function getHighestSeatID(bps) {
  return Math.max(...getSeatIds(bps));
}

function getYourSeat(bps) {
  const seatIds = getSeatIds(bps);
  seatIds.sort((a, b) => a - b);
  for (let i = 0; i < seatIds.length - 1; i++) {
    if (seatIds[i + 1] - seatIds[i] === 2) {
      return seatIds[i] + 1;
    }
  }
  throw new Error('Impossibru');
}

logTime('A', () => getHighestSeatID(boardingPasses));
logTime('B', () => getYourSeat(boardingPasses));
