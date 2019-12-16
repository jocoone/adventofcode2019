const { readLines } = require('../utils/readandwrite');
const { find } = require('lodash');
const IntCodeComputer = require('../common/icc');
const readlineSync = require('readline-sync');

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

function part1(file) {
    console.time('aoc15p1');
    const input = readLines(file)[0].split(',').map(Number);
    const latestPosition = {x: 0, y: 0};
    const walls = {};
    let samePosition = 0;
    const positions = [];
    let sc = 0;
    let lastMove = 1;
    let moves = [];

    function print() {
        const w = Object.keys(walls).map(x => x.split(',')).map(x => ({x: Number(x[0]), y: Number(x[1])}));
        let result = '';
        for (let y = 15; y > -25; y--) {
            for (let x = -35; x < 15; x++) {
                const wall = find(w, { x, y });
                if (wall) {
                    result += '#';
                } else {
                    if (x === latestPosition.x && y === latestPosition.y) {
                        result += 'D';
                    } else {
                        if (x === 0 && y === 0) {
                            result += '+';
                        } else {
                           const p = find(positions, {x, y});
                           if (p) {
                               result += '_';
                           } else {
                               result += '?';
                           }
                        }
                    }
                }
            }
            result += '\n';
        }
        console.log(result);
        console.log('----------------')
    }
    function droidMovement() {
        print();
        const move = readlineSync.question('Next move? ');
        if (move === 'q') lastMove = WEST;
        if (move === 'z') lastMove = NORTH;
        if (move === 's') lastMove = SOUTH;
        if (move === 'd') lastMove = EAST;
        return lastMove;
    }

    function getMove() {
        const possibleMoves = [NORTH, EAST, SOUTH, WEST].filter(move => {
            if (move === NORTH && walls[`${latestPosition.x},${latestPosition.y + 1}`]) {
                return false
            } else if (move === SOUTH && walls[`${latestPosition.x},${latestPosition.y - 1}`]) {
                 return false
            } else if (move === EAST && walls[`${latestPosition.x + 1},${latestPosition.y}`]) {
                 return false;
            } else if (move === WEST  && walls[`${latestPosition.x - 1},${latestPosition.y}`]) {
                 return false;
            }
            return true;
        });
        if (possibleMoves.length === 1) {
            return possibleMoves[0]
        } else {
            const randomMove = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomMove];
        }
    }

    function statusCode(result) {
        const statusCode = result.shift();
        sc = statusCode
        if (statusCode === 1 || statusCode === 2) {
            if (lastMove === NORTH) {
                latestPosition.y += 1;
            } else if (lastMove === SOUTH) {
                latestPosition.y -= 1;
            } else if (lastMove === EAST) {
                latestPosition.x += 1;
            } else {
                latestPosition.x -= 1;
            }
            moves.push(latestPosition);
            const p = find(positions, {x: latestPosition.x, y: latestPosition.y});
            if (!p) {
                positions.push({...latestPosition});
            }
        } else {
            if (lastMove === NORTH) {
                walls[`${latestPosition.x},${latestPosition.y + 1}`] = true;
            } else if (lastMove === SOUTH) {
                walls[`${latestPosition.x},${latestPosition.y - 1}`] = true;
            } else if (lastMove === EAST) {
                walls[`${latestPosition.x + 1},${latestPosition.y}`] = true;
            } else {
                walls[`${latestPosition.x - 1},${latestPosition.y}`] = true;
            }
        }
    }

    const computer = new IntCodeComputer(input, [], 1, statusCode, droidMovement);
    let i = 0;
    while(sc !== 2) {
        computer.run();
    }
    console.timeEnd('aoc15p1');
    return moves.length;
}

function part2(file) {
    console.time('aoc15p2');
    const input = readLines(file)[0].split(',').map(Number);
    const latestPosition = {x: 0, y: 0};
    const walls = {};
    const positions = [];
    let sc = 0;
    let lastMove = 1;
    let moves = [];

    function print() {
        const w = Object.keys(walls).map(x => x.split(',')).map(x => ({x: Number(x[0]), y: Number(x[1])}));
        let result = '';
        for (let y = 30; y > -30; y--) {
            for (let x = -35; x < 35; x++) {
                const wall = find(w, { x, y });
                if (wall) {
                    result += '#';
                } else {
                    if (x === latestPosition.x && y === latestPosition.y) {
                        result += 'D';
                    } else {
                        if (x === 0 && y === 0) {
                            result += '+';
                        } else {
                           const p = find(positions, {x, y});
                           if (p) {
                               result += '_';
                           } else {
                               result += '?';
                           }
                        }
                    }
                }
            }
            result += '\n';
        }
        console.log(result);
        console.log('----------------')
    }
    
    function droidMovement() {
        print();
        const move = readlineSync.question('Next move? ');
        if (move === 'q') lastMove = WEST;
        if (move === 'z') lastMove = NORTH;
        if (move === 's') lastMove = SOUTH;
        if (move === 'd') lastMove = EAST;
        return lastMove;
    }

    function getMove() {
        const possibleMoves = [NORTH, EAST, SOUTH, WEST].filter(move => {
            if (move === NORTH && walls[`${latestPosition.x},${latestPosition.y + 1}`]) {
                return false
            } else if (move === SOUTH && walls[`${latestPosition.x},${latestPosition.y - 1}`]) {
                 return false
            } else if (move === EAST && walls[`${latestPosition.x + 1},${latestPosition.y}`]) {
                 return false;
            } else if (move === WEST  && walls[`${latestPosition.x - 1},${latestPosition.y}`]) {
                 return false;
            }
            return true;
        });
        if (possibleMoves.length === 1) {
            return possibleMoves[0]
        } else {
            const randomMove = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomMove];
        }
    }

    function statusCode(result) {
        const statusCode = result.shift();
        sc = statusCode
        if (statusCode === 1 || statusCode === 2) {
            if (lastMove === NORTH) {
                latestPosition.y += 1;
            } else if (lastMove === SOUTH) {
                latestPosition.y -= 1;
            } else if (lastMove === EAST) {
                latestPosition.x += 1;
            } else {
                latestPosition.x -= 1;
            }
            const p = find(positions, {x: latestPosition.x, y: latestPosition.y});
            if (!p) {
                positions.push({...latestPosition});
            }
        } else {
            if (lastMove === NORTH) {
                walls[`${latestPosition.x},${latestPosition.y + 1}`] = true;
            } else if (lastMove === SOUTH) {
                walls[`${latestPosition.x},${latestPosition.y - 1}`] = true;
            } else if (lastMove === EAST) {
                walls[`${latestPosition.x + 1},${latestPosition.y}`] = true;
            } else {
                walls[`${latestPosition.x - 1},${latestPosition.y}`] = true;
            }
        }
    }

    const computer = new IntCodeComputer(input, [], 1, statusCode, droidMovement);
    while(sc !== 2) {
        computer.run();
    }

    positions[positions.length - 1].oxygen = true;
    console.log(positions.map(x => `${x.x},${x.y}`).join(';'));
 
    if (!find(positions, {x: 0, y: 0})) {
        positions.push({x: 0, y: 0});
    }

    let minutes = 0;

    while(positions.filter(p => !p.oxygen).length > 0) {
        const oxygen = positions.filter(p => p.oxygen);
        oxygen.forEach(oxygenPoint => {
            positions.filter(p => {
                if (p.x === oxygenPoint.x && Math.abs(p.y - oxygenPoint.y) === 1) {
                    return true;
                }
                if (p.y === oxygenPoint.y && Math.abs(p.x - oxygenPoint.x) === 1) {
                    return true;
                }
                return false;
            }).forEach(p => {
                p.oxygen = true;
            });
        });
        minutes++;
    }


    console.timeEnd('aoc15p2');
    return minutes;
}

// console.log(`${part1('input/aoc15.txt')}`)
console.log(`${part2('input/aoc15.txt')}`)

module.exports = {
    part1, part2
};