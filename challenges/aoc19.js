const { readLines } = require('../utils/readandwrite');
const { find, maxBy, minBy } = require('lodash');
const IntCodeComputer = require('../common/icc');

function part1(file) {
    console.time('aoc19p1');
    const input = readLines(file)[0].split(',').map(Number);
  
    const numbers = [];
    for(let y = 0; y < 50; y++){
        for (let x = 0; x < 50; x++) {
            numbers.push(x);
            numbers.push(y);
        }
    }

    let res = 0;
    function output(result, value) {
        if(value === 1) {
            res++;
        }
    }

    function moveDrone() {
        return numbers.shift();
    }

    for(let i = 0; i < 2500; i++) {
        const computer = new IntCodeComputer(input, [], 0, output, moveDrone)
        computer.run();
    }
    
    console.timeEnd('aoc19p1');
    return res;
}

function part2(file) {
    console.time('aoc19p2');
    const input = readLines(file)[0].split(',').map(Number);
  
    const MAGIC_VALUE = 341
    const numbers = [];
    for(let y = 0; y < MAGIC_VALUE; y++){
        for (let x = 0; x < MAGIC_VALUE; x++) {
            numbers.push(x);
            numbers.push(y);
        }
    }

    const beam = [];
    let x = 0;
    let y = 0;
    function output(result, value) {
        if(value === 1) {
           beam.push({x, y});
        }
    }

    let requests = 0;

    function moveDrone() {
        const inp = numbers.shift();
        if(requests % 2 === 0) {
            x = inp;
        } else {
            y = inp
        }
        requests++;
        return inp;
    }

    while(numbers.length > 0) {
        const computer = new IntCodeComputer(input, [], 0, output, moveDrone)
        computer.run();
    }
    
    let searchX = 0;
    let searchY = 0;
    for (let i = 0; i < beam.length; i++) {
        const p =  beam[i];
        const result = find(beam, pp => pp.x - p.x === 100 && pp.y - p.y === 100)
        if(result) {
            searchX = p.x;
            searchY = p.y;
        }
    }

    console.log(searchX, searchY);
    let result = '';
    for(let y = 0; y < maxBy(beam, p => p.y).y + 1; y++) {
        for(let x = 0; x < maxBy(beam, p => p.x).x + 1; x++) {
            if (find(beam, {x,y})) {
                result += '#'
            } else {
                result += ''
            }
        }
        result += '\n'
    }

    console.log(result);
    
    console.timeEnd('aoc19p2');
    return (searchX * 10000) + searchY;
}

console.log(`Part #1: ${part1('input/aoc19.txt')}`)
console.log(`Part #2: ${part2('input/aoc19.txt')}`)

module.exports = {
    part1, part2
};