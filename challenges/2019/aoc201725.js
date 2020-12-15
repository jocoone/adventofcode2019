const { readLines } = require('../utils/readandwrite');

class State {
    constructor(write, move, nextState) {
        this.write = write;
        this.move = move;
        this.nextState = nextState;
    }
}

function part1(file) {
    console.time('aoc201725p1');
    const input = readLines(file);
    const states = {};

    const memory = [];
    for (let i = 0; i < 100000; i++) {
        memory.push(0);
    }
    const beginState = /Begin in state (\w)/.exec(input[0])[1];
    const steps = Number(/Perform a diagnostic checksum after (\d+) steps/.exec(input[1])[1]);
    for(let i = 3; i < input.length; i+=10) {
        const stateName = /In state (\w)/.exec(input[i])[1];
        const stateWrite1 = Number(/Write the value (\d)/.exec(input[i + 2])[1]);
        const stateMove1 = (/Move one slot to the (\w+).$/.exec(input[i + 3])[1]) === 'right' ? 1 : -1;
        const nextState1 = (/Continue with state (\w)/.exec(input[i + 4])[1]);
        states[stateName + '0'] = new State(stateWrite1, stateMove1, nextState1);
        const stateWrite2 = Number(/Write the value (\d)/.exec(input[i + 6])[1]);
        const stateMove2 = (/Move one slot to the (\w+).$/.exec(input[i + 7])[1]) === 'right' ? 1 : -1;
        const nextState2 = (/Continue with state (\w)/.exec(input[i + 8])[1]);
        states[stateName + '1'] = new State(stateWrite2, stateMove2, nextState2);
    }

    let state = beginState;
    let cursor = memory.length / 2;
    for (let i = 0; i < steps; i++) {
        const value = memory[cursor];
        const s = states[state + `${value}`];
        memory[cursor] = s.write;
        cursor += s.move;
        state = s.nextState;
    }
    console.timeEnd('aoc201725p1');
    return memory.filter(x => x === 1).length;
}

function part2(file) {
    console.time('aoc201725p2');
    const input = readLines(file);

    console.timeEnd('aoc201725p2');
    return 0;
}

console.log(`Part 1: ${part1('input/aoc2017_25.txt')}`)

module.exports = {
    part1, part2
};