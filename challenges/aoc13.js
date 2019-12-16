const { readLines } = require('../utils/readandwrite');
const IntCodeProgram = require('../common/icc');
const { find } = require('lodash');

class Draw {
    constructor(x, y, block) {
        this.x = x;
        this.y = y;
        this.block = block;
    }
}

function createPoints(res) {
    const points = [];
    for (let i = 0; i < res.length; i += 3) {
        points.push(new Draw(res[i], res[i + 1], res[i + 2]));
    }
    return points;
}

function print(points) {
    let highestX = 0;
    let highestY = 0;

    for (let i = 0; i < points.length; i++) {
        if (points[i].x > highestX) {
            highestX = points[i].x
        }
        if (points[i].y > highestY) {
            highestY = points[i].y
        }
    }

    let result = '';
    for (let y = 0; y < highestY; y++) {
        for (let x = 0; x < highestX + 1; x++) {
            const point = find(points, { x, y });
            if (point) {
                if (point.block === 0) {
                    result += ' ';
                }
                if (point.block === 1) {
                    result += '|';
                }
                if (point.block === 2) {
                    result += '#';
                }
                if (point.block === 3) {
                    result += '_';
                }
                if (point.block === 4) {
                    result += 'o';
                }
            } else {
                result += ' ';
            }

        }
        result += '\n';
    }
    console.log(result);
}

function countBlocks(blocks, type) {
    let count = 0;
    for (let i = 0; i < blocks.length; i+=3) {
        if (blocks[i + 2] === type) {
            count++;
        }
    }
    return count;
}

function part1(file) {
    console.time('aoc13p1');
    const program = readLines(file)[0].split(',').map(Number);
    const result = countBlocks(new IntCodeProgram(program, [], 0).run(), 2);
    console.timeEnd('aoc13p1');
    return result;
}

function part2(file) {
    console.time('aoc13p2');
    const program = readLines(file)[0].split(',').map(Number);
    program[0] = 2;
    let ballX = 0;
    let paddleX = 0;
    let lastScore = 0;
    const res = new IntCodeProgram(program, [], 0).run();
    const points = createPoints(res);
    print(points);

    function sleep() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    function joyStick() {
        return ballX === paddleX ? 0 : (ballX < paddleX ? -1 : 1);
    }

    async function game(result) {
        if (result.length === 3) {
            const x = result.shift();
            const y = result.shift();
            const value = result.shift();

            if (x === -1 && y === 0) {
                lastScore = value;
            }

            if (value === 3) {
                const point = find(points, { block: value });
                point.x = x;
                point.y = y;
                paddleX = x;
            }

            if (value === 4) {
                const point = find(points, { block: value });
                point.x = x;
                point.y = y;
                ballX = x;
            }

            if (value === 0) {
                const point = find(points, { x, y });
                point.block = 0;
            }

            print(points);
            await sleep();
        }
    }

    const inputs = [];
    new IntCodeProgram(program, inputs, 0, game, joyStick).run(0);
    print(points);
    console.timeEnd('aoc13p2');
    return lastScore;
}

part2('input/aoc13.txt');

module.exports = {
    part1, part2
};