const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const NAVIGATIONS = {
  se: {
    x: 0.5,
    y: 1,
  },
  e: {
    x: 1,
    y: 0,
  },
  sw: {
    x: -0.5,
    y: 1,
  },
  w: {
    x: -1,
    y: 0,
  },
  nw: {
    x: -0.5,
    y: -1,
  },
  ne: {
    x: 0.5,
    y: -1,
  },
};
const i = logTime('Parse', () => readLines('input/2020/aoc24.txt').map(parse));

function parse(line) {
  const dirs = line.split('');
  const result = [];
  for (let i = 0; i < dirs.length; i++) {
    if (NAVIGATIONS[dirs[i]]) {
      result.push(dirs[i]);
    } else if (NAVIGATIONS[dirs[i] + dirs[i + 1]]) {
      result.push(dirs[i] + dirs[++i]);
    } else {
      throw new Error('Should not happen');
    }
  }
  return result;
}

function createTiles(navigations) {
  const tiles = {};
  navigations.forEach((navigation) => {
    const result = navigation
      .map((n) => NAVIGATIONS[n])
      .reduce((acc, x) => ({ x: acc.x + x.x, y: acc.y + x.y }), { x: 0, y: 0 });
    const tile = `${result.x},${result.y}`;
    if (!tiles[tile]) {
      tiles[tile] = 'black';
    } else {
      tiles[tile] = 'white';
    }
  });
  return tiles;
}

function solveA(navigations) {
  return Object.values(createTiles(navigations)).filter((x) => x === 'black')
    .length;
}

function mapTile(tile) {
  const [x, y] = tile.split(',');
  return {
    x: Number(x),
    y: Number(y),
  };
}

const DAYS = 100;

function solveB(navigations) {
  const tiles = createTiles(navigations);
  const xs = Object.keys(tiles).map((tile) => Number(tile.split(',')[0]));
  const ys = Object.keys(tiles).map((tile) => Number(tile.split(',')[1]));
  const maxX = Math.max(...xs);
  const minX = Math.min(...xs);
  const maxY = Math.max(...ys);
  const minY = Math.min(...ys);

  const EXTRA_TILES = DAYS / 2 + 1;
  for (let y = minY - EXTRA_TILES; y < maxY + EXTRA_TILES; y++) {
    const startX = Math.abs(y) % 2 === 0 ? 0 : 0.5;
    for (let x = minX - EXTRA_TILES + startX; x < maxX + EXTRA_TILES; x++) {
      if (!tiles[`${x},${y}`]) {
        tiles[`${x},${y}`] = 'white';
      }
    }
  }

  for (let i = 0; i < DAYS; i++) {
    const blackTiles = Object.keys(tiles)
      .filter((tile) => tiles[tile] === 'black')
      .map(mapTile);
    const whiteTiles = Object.keys(tiles)
      .filter((tile) => tiles[tile] === 'white')
      .map(mapTile);
    const whiteFlips = blackTiles.filter((tile) => {
      const adjacentBlackTiles = Object.values(NAVIGATIONS)
        .map(
          (navigation) => `${tile.x + navigation.x},${tile.y + navigation.y}`
        )
        .map((tile) => tiles[tile] === 'black')
        .filter((black) => black).length;
      return adjacentBlackTiles === 0 || adjacentBlackTiles > 2;
    });
    const blackFlips = whiteTiles.filter((tile) => {
      const adjacentBlackTiles = Object.values(NAVIGATIONS)
        .map(
          (navigation) => `${tile.x + navigation.x},${tile.y + navigation.y}`
        )
        .map((tile) => tiles[tile] === 'black')
        .filter((black) => black).length;
      return adjacentBlackTiles === 2;
    });
    // console.log(whiteFlips.length, blackFlips.length);
    whiteFlips.forEach(
      (whiteFlip) => (tiles[`${whiteFlip.x},${whiteFlip.y}`] = 'white')
    );
    blackFlips.forEach(
      (blackFlip) => (tiles[`${blackFlip.x},${blackFlip.y}`] = 'black')
    );
  }

  return Object.values(tiles).filter((x) => x === 'black').length;
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
