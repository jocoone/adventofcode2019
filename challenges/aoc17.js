const { readLines } = require('../utils/readandwrite');
const { find, uniq } = require('lodash');
const IntCodeComputer = require('../common/icc');

function getScaffolds(input, ...filter) {
    const computer = new IntCodeComputer(input, [], 0);
    let y = 0;
    let x = 0;
    return computer.run().map((p) => {
        const point =  { x, y, scaffold: p };
        if (p === 10) {
            x = 0;
            y++;
            return null;
        }
        x++;
        return point;
    }).filter(x => !!x)
    .filter(x => filter.includes(x.scaffold))
}

function part1(file) {
    console.time('aoc17p1');
    const input = readLines(file)[0].split(',').map(Number);

    const result = getScaffolds(input, 35).filter(({x, y}, i, result) => {
        const above = find(result, { x, y: y - 1});
        const underneath = find(result, { x, y: y + 1});
        const left = find(result, { x: x - 1, y});
        const right = find(result, { x: x + 1, y});
        return above && underneath && left && right;
    }).map(({x, y}) => x * y).reduce((a, b) => a + b, 0);

    console.timeEnd('aoc17p1');
    return result;
}

function part2(file) {
    console.time('aoc17p2');
    const input = readLines(file)[0].split(',').map(Number);
    const result = [];
    const UP = '^'.charCodeAt(0);
    const RIGHT = '>'.charCodeAt(0);
    const LEFT = '<'.charCodeAt(0);
    const DOWN = 'v'.charCodeAt(0);

    const scaffolds = getScaffolds(input, 35, UP, RIGHT, LEFT, DOWN);
    const begin = find(scaffolds, ({scaffold}) => scaffold === UP || scaffold === RIGHT || scaffold === DOWN || scaffold === LEFT);
    
    const left = find(scaffolds, {x: begin.x - 1, y: begin.y});
    const right = find(scaffolds, {x: begin.x + 1, y: begin.y});
    const up = find(scaffolds, {x: begin.x, y: begin.y - 1});
    const down = find(scaffolds, {x: begin.x, y: begin.y + 1});

    const path = [begin];
    while (path.length < scaffolds.length) {
        const lastPoint = path[path.length - 1];
        const left = find(scaffolds, {x: lastPoint.x - 1, y: lastPoint.y});
        const right = find(scaffolds, {x: lastPoint.x + 1, y: lastPoint.y});
        const up = find(scaffolds, {x: lastPoint.x, y: lastPoint.y - 1});
        const down = find(scaffolds, {x: lastPoint.x, y: lastPoint.y + 1});
        const options = uniq([left, down, right, up]).filter(p => path.length === 1 || (p.x !== path[path.length - 2].x && p.y !== path[path.length - 2].y));
        if (options.length === 1) {
            path.push(options.filter(x => !!x)[0]);
        } else {
            const intersectionPoints = [left, down, up, right].filter(p => p.x !== path[path.length - 2].x && p.y !== path[path.length - 2].y);
        }

    }





    input[0] = 2;

    function output(r) {
        result.push(...r);
    }

    function moves(inputs) {

    }

    const droid = new IntCodeComputer(input, [], 0, output, moves);



    console.timeEnd('aoc17p2');
    console.log(result);
    return result[result.length - 1];
}

console.log(`Part #1: ${part1('input/aoc17.txt')}`)
console.log(`Part #2: ${part2('input/aoc17.txt')}`)

module.exports = {
    part1, part2
};