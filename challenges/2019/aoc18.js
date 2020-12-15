const { readLines } = require('../utils/readandwrite');
const { maxBy } = require('lodash');

function isKey(location) {
    return /[a-z]{1}/.exec(location)
}
function isDoor(location) {
    return /[A-Z]{1}/.exec(location)
}

function getPossibleMoves(grid, location) {
    const possibleMoves = [];
    for(let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (x === location.x && y === location.y) {
                if (grid[y][x + 1] === '.' || isKey(grid[y][x + 1])) possibleMoves.push({x: x + 1, y})
                if (grid[y][x - 1] === '.' || isKey(grid[y][x - 1])) possibleMoves.push({x: x - 1, y})
                if (grid[y + 1][x] === '.' || isKey(grid[y + 1][x])) possibleMoves.push({x, y: y + 1})
                if (grid[y - 1][x] === '.' || isKey(grid[y - 1][x])) possibleMoves.push({x, y: y + 1})
                return possibleMoves;
            }
        }
    }
    return possibleMoves;
}

function getKeys(grid) {
    const keys = []
    for(let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const cc = grid[y][x].charCodeAt(0);
            if (cc >= 95 && cc <= 120) {
                keys.push({x,y, c: grid[y][x]});
            }
        }
    }
    return keys;
}

function findWay(grid, position, end) {
    var queue = [];

    queue.push([position]); // store a path, not just a position

    while (queue.length > 0) {
        var path = queue.shift(); // get the path out of the queue
        var pos = path[path.length-1]; // ... and then the last position from it
        var direction = [
            {x: pos.x + 1, y: pos.y},
            {x: pos.x - 1, y: pos.y},
            {x: pos.x, y: pos.y + 1},
            {x: pos.x, y: pos.y - 1},
        ];

        for (var i = 0; i < direction.length; i++) {
            // Perform this check first:
            if (direction[i].x == end.x && direction[i].y == end.y) {
                // return the path that led to the find
                return path.concat([end]); 
            }
            
            if (grid[direction[i].y][direction[i].x] === '#') {
                continue;
            }

            if (isDoor(grid[direction[i].y][direction[i].x])) {
                return null;
            }

            // grid[direction[i].y][direction[i].x] = 1;
            // extend and push the path on the queue
            queue.push(path.concat([direction[i]])); 
        }
    }

    return queue;
}

class Path {
    constructor(location) {
        this.location = location;
        this.options = [];
    }
}

function part1(file) {
    console.time('aoc18p1');
    const grid = readLines(file).map(x => x.split(''));
    const keys = [];
    const doors = [];
    const location = {}
    for(let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const cc = grid[y][x].charCodeAt(0);
            if (cc >= 65 && cc <= 90) {
                doors.push({x,y, c: grid[y][x]})
            }
            if (cc >= 95 && cc <= 120) {
                keys.push({x,y, c: grid[y][x]});
            }
            if (grid[y][x] === '@') {
                location.x = x;
                location.y = y;
            }
        }
    }

    let steps = 0;


    while(getKeys(grid).length > 0) {
        const paths = keys.map(key => findWay(grid, location, key)).filter(x => !!x);
        console.log(paths);
        const maxLengthPath = maxBy(paths, x => x && x.length);
        steps += (maxLengthPath.length - 1);
        const newLocation = maxLengthPath[maxLengthPath.length - 1];
        location.x = newLocation.x;
        location.y = newLocation.y;
        grid[location.y][location.x] = '.';
        doors.forEach(door => {
            if (door.c.toLowerCase() === newLocation.c) {
                grid[door.y][door.x] = '.';
            }
        });
        console.log(grid.map(x => x.join('')).join('\n'));
    }

    console.timeEnd('aoc18p1');
    return steps;
}

function part2(file) {
    console.time('aoc18p2');
    const input = readLines(file);

    console.timeEnd('aoc18p2');
    return 0;
}

console.log(`Part #1: ${part1('input/aoc18test.txt')}`)
console.log(`Part #2: ${part2('input/aoc18.txt')}`)

module.exports = {
    part1, part2
};