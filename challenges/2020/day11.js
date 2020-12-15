const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => readLines('input/2020/aoc11.txt').map(parse));

function parse(x) {
  return x.split('');
}

function seatsOccupied(seats) {
  return seats
    .map((row) => row.filter((seat) => seat === '#').length)
    .reduce((acc, x) => acc + x, 0);
}

function print(seats) {
  console.log(seats.map((x) => x.join('')).join('\n'));
  console.log('-----------------------');
}

function calculate(input, seatChange, lookFurther) {
  let so;
  let result;
  let it = 0;
  do {
    result = [...input.map((x) => [...x])];
    so = seatsOccupied(input);

    for (let row = 0; row < input.length; row++) {
      for (let seat = 0; seat < input[0].length; seat++) {
        let count = 0;
        const maxRow = lookFurther ? input.length : row + 2;
        const minRow = lookFurther ? 0 : row - 1;
        const maxSeat = lookFurther ? input[row].length : seat + 2;
        const minSeat = lookFurther ? 0 : seat - 1;
        for (let r = row - 1; r >= minRow; r--) {
          // UP
          if (!input[r]) {
            break;
          }

          if (input[r] && input[r][seat] === '#') {
            count++;
          }
          if (input[r] && input[r][seat] !== '.') {
            break;
          }
        }

        for (let r = row + 1; r < maxRow; r++) {
          // DOWN
          if (!input[r]) {
            break;
          }
          if (input[r] && input[r][seat] === '#') {
            count++;
          }
          if (input[r] && input[r][seat] !== '.') {
            break;
          }
        }

        for (let s = seat + 1; s < maxSeat; s++) {
          // RIGHT
          if (input[row][s] === '#') {
            count++;
          }
          if (input[row][s] !== '.') {
            break;
          }
        }

        for (let s = seat - 1; s >= minSeat; s--) {
          // LEFT
          if (input[row][s] === '#') {
            count++;
          }
          if (input[row][s] !== '.') {
            break;
          }
        }

        for (let s = seat - 1, r = row - 1; r >= minRow; s--) {
          // LEFT UP
          if (!input[r]) {
            break;
          }
          if (input[r] && input[r][s] === '#') {
            count++;
          }
          if (input[r] && input[r][s] !== '.') {
            break;
          }
          r--;
        }

        for (let s = seat + 1, r = row - 1; r >= minRow; s++) {
          // RIGHT UP
          if (!input[r]) {
            break;
          }
          if (input[r] && input[r][s] === '#') {
            count++;
          }
          if (input[r] && input[r][s] !== '.') {
            break;
          }
          r--;
        }

        for (let s = seat - 1, r = row + 1; r < maxRow; s--) {
          // LEFT DOWN
          if (!input[r]) {
            break;
          }
          if (input[r] && input[r][s] === '#') {
            count++;
          }
          if (input[r] && input[r][s] !== '.') {
            break;
          }
          r++;
        }

        for (let s = seat + 1, r = row + 1; r < maxRow; s++) {
          // RIGHT DOWN
          if (!input[r]) {
            break;
          }
          if (input[r] && input[r][s] === '#') {
            count++;
          }
          if (input[r] && input[r][s] !== '.') {
            break;
          }
          r++;
        }

        if (input[row][seat] === 'L' && count === 0) {
          result[row][seat] = '#';
        }
        if (input[row][seat] === '#' && count >= seatChange) {
          result[row][seat] = 'L';
        }
      }
    }
    input = [...result.map((x) => [...x])];
    it++;
  } while (so != seatsOccupied(input));
  return seatsOccupied(input);
}

function solveATest(input) {
  return calculate(input, 4, false);
}

function solveB(input) {
  return calculate(input, 5, true);
}

logTime('A', () => solveATest(i));
logTime('B', () => solveB(i));
