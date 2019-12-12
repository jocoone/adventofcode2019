const { part1, part2 } = require('../challenges/aoc12.js');

describe('Day 12', () => {
    describe('Part 1', () => {
        it('should be the same', () => {
            expect(part1('input/aoc12test.txt', 10)).toEqual(179);
            expect(part1('input/aoc12test2.txt', 100)).toEqual(1940);
            expect(part1('input/aoc12.txt', 1000)).toEqual(13399);
        });
    });
    describe('Part 2', () => {
        it('should be the same', () => {
            expect(part2('input/aoc12test.txt')).toEqual(2772);
            expect(part2('input/aoc12test2.txt')).toEqual(4686774924);
            expect(part2('input/aoc12.txt')).toEqual(312992287193064);
        });
    });
});