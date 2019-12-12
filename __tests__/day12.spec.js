const { part1, part2 } = require('../challenges/aoc12.js');

describe('Day 11', () => {
  describe('Part 1', () => {
    it('should be the same', () => {
      expect(part1('input/aoc12test.txt')).toEqual();
      expect(part1('input/aoc12.txt')).toEqual();
    });
  });

  describe('Part 2', () => {
    it('should be the same', () => {
      expect(part2('input/aoc12test.txt')).toEqual();
      expect(part2('input/aoc12test.txt')).toEqual();
    });
  });
})