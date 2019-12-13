const { readLines } = require('../utils/readandwrite');
const IntCodeProgram = require('../common/icc');

class Draw {
    constructor(x, y, block) {
        this.x = x;
        this.y = y;
        this.block = block;
    }
}
function createBlocks(res) {
    const blocks = [];
    for (let i = 0; i < res.length; i+=3) {
        blocks.push(new Draw(res[i], res[i + 1], res[i + 2]));
    }
    return blocks;
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

    function joyStick() {
        if(ballX < paddleX) return -1;
        if(ballX > paddleX) return 1;
        return 0;
    }

    function game(result) {
        if (result.length === 3) {
            const x = result.shift();
            const y = result.shift();
            const value = result.shift();

            if (x === -1 && y === 0) {
                lastScore = value;
            }

            if (value === 3) {
                paddleX = x;
            }

            if (value === 4) {
                ballX = x;
            }
        }
    }

    const inputs = [];
    new IntCodeProgram(program, inputs, 0, game, joyStick).run(0);

    console.timeEnd('aoc13p2');
    return lastScore;
}

module.exports = {
    part1, part2
};