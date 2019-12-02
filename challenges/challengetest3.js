const { readLines, write } = require('../utils/readandwrite');

const lines = readLines('input/test3.txt').map(line => line.split(', '));

function getData(lines, op) {
  let smallestX = 100000;
  let largestX = 0;

  lines.forEach(line => {
    let partToWorkWith = line[1];
    if (line[0].includes(op)) {
      partToWorkWith = line[0];
    }
    if (partToWorkWith.includes('..')) {
      const nums = partToWorkWith.split('=')[1].split('..')
      const x1 = parseInt(nums[0]);
      const x2 = parseInt(nums[1]);
      if (smallestX > x1) {
        smallestX = x1;
      }
      if (smallestX > x2) {
        smallestX = x2;
      }
      if (largestX < x1) {
        largestX = x1;
      }
      if (largestX < x2) {
        largestX = x2;
      }
    } else {
      const num = parseInt(partToWorkWith.split('=')[1]);
      if (smallestX > num) {
        smallestX = num;
      }
      if (largestX < num) {
        largestX = num;
      }
    }
  });

  return { smallest: smallestX, largest: largestX };
}

function prepareGround(xData, yData) {
  console.log('x: ' + JSON.stringify(xData), 'y: ' +  JSON.stringify(yData));
  const ground = [];

  for (let y = 0; y  < yData.largest + 3; y++ ) {
    const xline = [];
    for (let x = 0; x < xData.largest - xData.smallest + 3; x++) {
      if (y === 0 && x + xData.smallest - 1 === 500) {
        xline.push('+');
      } else {
        xline.push('.');
      }
    }
    ground.push(xline);
  }
  return ground;
}

function addClay(ground, lines, xData) {
  lines.forEach(line => {
    if (line[0].includes('x')) {
      const xx = parseInt(line[0].split('=')[1]) - xData.smallest + 1;
      const yy = line[1].split('=')[1];
      const y1 = parseInt(yy.split('..')[0]);
      const y2 = parseInt(yy.split('..')[1]);

      for (let y = y1; y <= y2; y++) {
        ground[y][xx] = '#';
      }
    } else {
      const yy = parseInt(line[0].split('=')[1]);
      const xx = line[1].split('=')[1];
      const x1 = parseInt(xx.split('..')[0]) - xData.smallest + 1;
      const x2 = parseInt(xx.split('..')[1]) - xData.smallest + 1;

      for (let x = x1; x < x2; x++) {
        ground[yy][x] = '#';
      }
    }
  });
}

function printGround(ground) {
  for(let i = 0; i < ground.length; i++) {
    const line = ('' + (i < 10 ? '0' + i : i) + ') ' + ground[i]).replace(/,/g, ' ');
    console.log(line);
  }
  console.log('--------------------------')
}

function getNextX(init, ground, xData) {
  if (init) {
    for (let y = 0; y < ground.length; y++) {
      for (let x = 0; x < ground[0].length; x++) {
        if (ground[y][x] === '+') {
          return x;
        }
      }
    }
  } else {
    for (let y = 0; y < ground.length; y++) {
      for (let x = 0; x < ground[0].length; x++) {
        if (ground[y][x] === '|' && ground[y + 1][x] === '.') {
          return x;
        }
        if (ground[y][x] === '|' && ground[y + 1][x] === '#') {
          if (ground[y][x + 1] === '#') {
            return x - 1;
          }
          if (ground[y][x - 1] === '#') {
            return x + 1;
          }
        }
      }
    }
  }
}

let lol = 0;
function calculateWaterFlow(init, ground, xData, yData) {
  if (init) {
    for (let x = 0; x < ground[0].length; x++) {
      if (ground[0][x] === '+') {
        ground[1][x] = '|';
        return calculateWaterFlow(false, ground, xData, yData);
      }
    }
  }
  for (let y = 0; y < ground.length; y++) {
    for (let x = 0; x < ground[0].length; x++) {
      if (ground[y][x] === '|' && y < yData.largest && ground[y + 1][x] === '.') {
        ground[y + 1][x] = '|';
        lol++;
        continue;
      }
      if (ground[y][x] === '|' && ground[y][x + 1] === '|') {
        continue;
      }
      if (ground[y][x] === '|' && ground[y + 1][x] === '#') {
        ground[y][x] = '~';
        let leftX = x - 1;
        let rightX = x + 1;
        for (let xx = x - 1; ground[y][xx] != '#'; xx--) {
          ground[y][xx] = '~';
          leftX = xx;
        }
        for (let xx = x + 1; ground[y][xx] != '#'; xx++) {
          ground[y][xx] = '~';
          rightX = xx + 1;
        }
        let yy = y - 1;
        let xx;
        do {
          for (let xxx = leftX; xxx < rightX; xxx++) {
            if (ground[yy][xxx] == '#') {
              leftX = xxx;
            }
          }
          xx = leftX;
          for (; xx < rightX ; xx++) {
            if (ground[yy][xx] !== '#') {
              ground[yy][xx] = '~';
            }
          }
          yy--;
        } while (ground[yy][xx] == '#');
        if (ground[yy][leftX] === '#') {
          for (let xxx = leftX + 1; xxx < rightX + 2; xxx++) {
            ground[yy][xxx] = '|';
          }
        } else {
          for (let xxx = leftX; xxx > 0; xxx--) {
            ground[yy][xxx] = '|';
            if (ground[yy+1][xxx] === '.') {
              break;
            }
          }
          for (let xxx = leftX - 1 ; xxx < yData.largest; xxx++) {
            ground[yy][xxx] = '|';
            if (ground[yy+1][xxx] === '.') {
              break;
            }
          }
        }
        x = xx;

        let xxx = xx + 1;
        do {
          if (ground[yy][xxx - 1] === '.') {
            x = xxx - 1;
            break;
          }
          if (ground[yy][xxx - 1] === '#') {
            x = xx;
            break;
          }
          xxx--;
        } while(true);
        y = yy;

        lol++;
      }
    }
  }
}

function countWater(ground) {
  let result = 0;
  ground.forEach(line => {
    line.forEach(block => {
      if (block === '~' || block === '|') {
        result++;
      }
    })
  })
  return result;
}

const xData = getData(lines, 'x');
const yData = getData(lines, 'y');

const ground = prepareGround(xData, yData);
addClay(ground, lines, xData);
printGround(ground);
calculateWaterFlow(true, ground, xData, yData);
// printGround(ground);

const output = ground.map(line => ('' + line).replace(/,/g, ' ') + '\n');

console.log('# waterblock: ' + countWater(ground));

write(output, 'output/test3.txt');
