const { readLines } = require('../utils/readandwrite');
const { find } = require('lodash');
const IntCodeComputer = require('../common/icc');


function createPattern(repeat, length) {
    const bastPattern = [0, 1, 0, -1];
    const result = [];
    let repPos = 0;
    for (let i = 0; i < length; i++) {
        for (let r = 0; r < repeat; r++) {
            result.push(bastPattern[repPos]);
        }
        repPos = (repPos + 1) % 4;
    }
    const temp = result.shift();
    result.push(temp);
    return result.slice(0, length);
}

function calculation(ss, p)  {
    const pattern = p.filter(x => x!==0);
    const skippedIndexes = [];
    for (let i = 0; i < p.length; i++) {
        if (p[i] === 0 || ss[i] === 0) {
            skippedIndexes.push(i);
        }
    }
    let result = 0;
    const signal = ss.filter((v, i) => !skippedIndexes.includes(i));
    for (let i = 0; i < signal.length; i++) {
        result += signal[i] * pattern[i];
    }
    const s = '' + result;
    return Number(s[s.length - 1]);
}

function calculateSignal(signal, r, log) {
    const repeatedSignal = [];
    for (let i = 0; i < r; i++) {
        const result = [];
        for (let pos = 0; pos < signal.length; pos++) {
            const repeat = pos + 1;
            const pattern = createPattern(repeat, signal.length);

            const s = calculation(signal, pattern);
            result.push(s);
        }
        signal = result;
        console.timeLog(log, `phase ${i + 1}`)
    }
    return signal;
}

function part1(file) {
    console.time('aoc16p1');
    let input = readLines(file)[0].split('').map(Number);
    const signal = calculateSignal(input, 100, 'aoc16p1');

    const result = signal.reduce((a, b) => a + b, '').slice(0, 8);
    console.timeEnd('aoc16p1');
    return result;
}

function part2(file) {
    console.time('aoc16p2');
    const input = readLines(file)[0].split('').map(Number);
    let signal = [];
    for (let i = 0; i < 10000; i++) {
        signal.push(...input);
    }
    const signal = calculateSignal(input, 100, 'aoc16p2');

    const result = signal.reduce((a, b) => a + b, '').slice(0, 8);
    console.timeEnd('aoc16p2');
    return result;
}

console.log(`Signal after 100 phases: ${part1('input/aoc16.txt')}`)
console.log(`Singal after 10000 phases: ${part2('input/aoc16test.txt')}`)

module.exports = {
    part1, part2
};