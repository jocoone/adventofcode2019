const { part1, part2 } = require('../challenges/aoc13.js');

describe('Day 12', () => {
    describe('Part 1', () => {
        it('should be the same', () => {
            expect(part1('input/aoc13.txt')).toEqual(286);
        });
    });
    describe('Part 2', () => {
        it('should be the same', () => {
            expect(part2('input/aoc13.txt')).toEqual(14538);
        });
    });
});