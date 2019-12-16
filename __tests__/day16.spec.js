const { part1, part2 } = require('../challenges/aoc16.js');

describe('Day 12', () => {
    describe('Part 1', () => {
        it('should be the same', () => {
            expect(part1('input/aoc16.txt')).toEqual('29795507');
            expect(part1('input/aoc16test2.txt')).toEqual('24176176');
            expect(part1('input/aoc16test3.txt')).toEqual('73745418');
            expect(part1('input/aoc16test4.txt')).toEqual('52432133');
        });
    });
    
    describe('Part 2', () => {
        it('should be the same', () => {
            expect(part2('input/aoc16.txt')).toEqual('89568529');
            expect(part2('input/aoc16test.txt')).toEqual('84462026');
            expect(part2('input/aoc16test5.txt')).toEqual('78725270');
            expect(part2('input/aoc16test6.txt')).toEqual('53553731');
        });
    });
});