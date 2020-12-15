const { readLines } = require('../utils/readandwrite');

function getPoint(area, x, y) {
  if (area && area[y] && area[y][x] === '#') return area[y][x];
}

function getAdjacentBugs(area, x, y) {
  return [getPoint(area, x, y + 1),
    getPoint(area, x, y - 1),
    getPoint(area, x + 1, y),
    getPoint(area, x - 1, y)
  ].filter(x => !!x).length;
} 

function getAdjacentBugs2(area, x, y, areaAbove, areaBelow) {
  const tiles = [];
  if (x === 1 && y === 2) {
    tiles.push(getPoint(area, x -1, y),
      getPoint(area, x, y -1),
      getPoint(area, x, y + 1));
    if (areaBelow) {
      for (let y = 0; y < areaBelow.length; y++ ) {
        tiles.push(getPoint(areaBelow, 0, y));
      }
    }
  } else if (x === 3 && y === 2) {
    tiles.push(getPoint(area, x + 1, y),
      getPoint(area, x, y - 1),
      getPoint(area, x, y + 1));
    if (areaBelow) {
      for (let y = 0; y < areaBelow.length; y++ ) {
        tiles.push(getPoint(areaBelow, 4, y));
      }
    }
  } else if (x === 2 && y === 1) {
    tiles.push(getPoint(area, x + 1, y),
      getPoint(area, x - 1, y),
      getPoint(area, x, y - 1));
    if (areaBelow) {
      for (let x = 0; x < areaBelow.length; x++ ) {
        tiles.push(getPoint(areaBelow, x, 0));
      }
    }
  } else if (x === 2 && y === 3) {
    tiles.push(getPoint(area, x + 1, y),
      getPoint(area, x - 1, y),
      getPoint(area, x, y + 1));
    if (areaBelow) {
      for (let x = 0; x < areaBelow.length; x++ ) {
        tiles.push(getPoint(areaBelow, x, 4));
      }
    }
  } else if (x === 0) {
    tiles.push(getPoint(area, x + 1, y), getPoint(area, x, y - 1), getPoint(area, x, y + 1));
    if (y === 0) {
      tiles.push(getPoint(areaAbove, 2, 1))
    }
    if (y === 4) {
      tiles.push(getPoint(areaAbove, 2, 3))
    }
    tiles.push(getPoint(areaAbove, 1, 2));
  } else if (x === 4) {
    tiles.push(getPoint(area, x - 1, y), getPoint(area, x, y - 1), getPoint(area, x, y + 1));
    if (y === 0) {
      tiles.push(getPoint(areaAbove, 2, 1))
    }
    if (y === 4) {
      tiles.push(getPoint(areaAbove, 2, 3))
    }
    tiles.push(getPoint(areaAbove, 3, 2));
  } else if (x < 4 && y === 0) {
    tiles.push(
      getPoint(area, x - 1, y),
      getPoint(area, x + 1, y),
      getPoint(area, x, y + 1),
      getPoint(areaAbove, 2, 1));
  } else if (x < 4 && y === 4) {
    tiles.push(
      getPoint(area, x - 1, y),
      getPoint(area, x + 1, y),
      getPoint(area, x, y - 1),
      getPoint(areaAbove, 2, 3));
  } else {
    tiles.push(getPoint(area, x, y + 1),
      getPoint(area, x, y - 1),
      getPoint(area, x + 1, y),
      getPoint(area, x - 1, y));
  }
  return tiles.filter(x => !!x).length;
} 

function getNewArea(area) {
  const newArea = [];
  for (let y = 0; y < area.length; y++) {
    let row = ''
    for(let x = 0; x < area[0].length; x++) {
      const adjacentBugs = getAdjacentBugs(area, x, y)
      if (area[y][x] === '#') {
        if (adjacentBugs !== 1) {
          row += '.';
        } else {
          row += '#';
        }
      } else {
        if (adjacentBugs === 1 || adjacentBugs === 2) {
          row += '#';
        } else {
          row += '.'
        }
      }
    }
    newArea.push(row);
  }
  return newArea;
}

function getNewArea2(layers, layer) {
  const area = layers[layer];
  const areaAbove = layers[layer + 1];
  const areaBelow = layers[layer - 1];

  const newArea = [];
  for (let y = 0; y < area.length; y++) {
    let row = ''
    for(let x = 0; x < area[0].length; x++) {
      const adjacentBugs = getAdjacentBugs2(area, x, y, areaAbove, areaBelow)
      if (x === 2 && y === 2) {
        row += '?'
      } else {
        if (area[y][x] === '#') {
          if (adjacentBugs !== 1) {
            row += '.';
          } else {
            row += '#';
          }
        } else {
          if (adjacentBugs === 1 || adjacentBugs === 2) {
            row += '#';
          } else {
            row += '.'
          }
        }
      }
    }
    newArea.push(row);
  }
  return newArea;
}

function part1(file) {
    console.time('aoc24p1');
    let area = readLines(file);

    let result;
    const repeat = new Set();

    while(!result) {
      const newArea = getNewArea(area);
      
      const a = newArea.join('');
      if (repeat.has(a)) {
        result = newArea;
      } else {
        area = newArea;
        repeat.add(a);
      }
    }

    const res = result.join('').split('').reduce((a, b, index) => {
      return a + (b === '#' ? Math.pow(2, index) : 0);
    }, 0);

    console.timeEnd('aoc24p1');
    return res;
  }


  function part2(file) {
    console.time('aoc24p2');  
    const layers = {};
    for (let i = -200; i < 200; i++) {
      layers[i] = ['.....','.....','..?..','.....','.....'];
    }
    layers[0] = readLines(file);
    layers[0][2][2] = '?';
    
    for(let i = 0; i < 200; i++) {
      const newLayers = {}
      Object.keys(layers).map(Number).forEach(layer => {
        newLayers[layer] = getNewArea2(layers, layer);
      });
      Object.keys(layers).map(Number).forEach(layer => {
        layers[layer] = newLayers[layer];
      })
    }

    const result = Object.keys(layers).reduce((a, l) => {
      return a + layers[l].join('').split('').filter(x => x === '#').length;
    }, 0)
  
    console.timeEnd('aoc24p2');
    return result;
  }

  console.log(`Part #1: ${part1('input/aoc24.txt')}`);
  console.log(`Part #2: ${part2('input/aoc24.txt')}`);
  
  module.exports = {
    part1, part2
  };