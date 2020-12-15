const { readLines } = require('../utils/readandwrite');

function getPattern(index, repeat) {
    const basePattern = [0, 1, 0, -1];
    const position = index + 1;
    return basePattern[Math.floor((position % (4 * repeat)) / repeat)]
}

function calculation(signal, repeat)  {
    return Math.abs(signal.reduce((a, val, index) => a + (val * getPattern(index, repeat)), 0)) % 10;
}

function calculateSignal(signal, r) {
    for (let i = 0; i < r; i++) {
        for (let pos = 0; pos < signal.length; pos++) {
            signal[pos] = calculation(signal, pos + 1);
        }
    }
    return signal;
}

function part1(file) {
    console.time('aoc16p1');
    const input = readLines(file)[0].split('').map(Number);
    const signal = calculateSignal(input, 100,'aoc16p1');
    const result = signal.reduce((a, b) => a + b, '').slice(0, 8);
    console.timeEnd('aoc16p1');
    return result;
}

function part2(file) {
    console.time('aoc16p2');
    const input = readLines(file)[0].split('').map(Number);
    const offset = Number(input.slice(0,7).reduce((a, b) => a + b, ''));
    let signal = [];
    
    for (let i = 0; i < 10000; i++) {
        signal.push(...input);
    }

    signal = signal.slice(offset);
    for (let phase = 1; phase <= 100; phase++) {
        for (let i = signal.length - 1; i >= 0; i--) {
            signal[i] = Math.abs((signal[i + 1] || 0) + signal[i]) % 10;
        }
    }
    const result = signal.slice(0, 8).join('');
    console.timeEnd('aoc16p2');
    return result;
}

module.exports = {
    part1, part2
};