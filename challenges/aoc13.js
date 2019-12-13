const { readLines } = require('../utils/readandwrite');
const IntCodeProgram = require('../common/icc');

class Draw {
    constructor(x, y, block) {
        this.x = x;
        this.y = y;
        this.block = block;
    }
}

function countBlocks(res) {
    const blocks = []
    for (let i = 0; i < res.length; i+=3) {
        blocks.push(new Draw(res[i], res[i + 1], res[i + 2]));
    }
    return blocks.filter(b => b.block === 2).length;
}

function part1(file) {
    console.time('aoc13p1');
    const program = readLines(file)[0].split(',').map(Number);
    const intCodeComputer = new IntCodeProgram(program, [], 0);
    const res = intCodeComputer.run();
    const result = countBlocks(res);
    console.timeEnd('aoc13p1');
    return result;
}

function part2(file) {
    console.time('aoc13p2');
    const program = readLines(file)[0].split(',').map(Number);
    const intCodeComputer = new IntCodeProgram(program, [], 0);

    let res = intCodeComputer.run(0);

    let lastScore = 0;

    while(countBlocks(res) > 0) {
        console.log(intCodeComputer.copy(3).run(0));
        const [,,score1] = intCodeComputer.copy(3).run(0);
        const [,,score2] = intCodeComputer.copy(3).run(1);
        const [,,score3] = intCodeComputer.copy(3).run(-1);

        const maxScore = Math.max([score1, score2, score3]);
        if (maxScore === score3) {
            res = intCodeComputer.run(-1);
        } else if (maxScore === score2) {
            res = ntCodeComputer.run(1);
        } else {
            res = intCodeComputer.run(0);
        }
        for (let i = 0; i < res.length; i+= 3) {
            if (res[i] === -1 && res[i + 1] === 0) {
                lastScore = res[i + 2];
                break;
            }
        }
    }    

    console.timeEnd('aoc13p2');
    return lastScore;
}

console.log(`Part #1: ${part1('input/aoc13.txt')} block tiles when the game starts.`);
console.log(`Part #2: ${part2('input/aoc13.txt')} score`);

module.exports = {
    part1, part2
};