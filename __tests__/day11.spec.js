const { part1, part2 } = require('../challenges/aoc11.js');

describe('Day 11', () => {
  describe('Part 1', () => {
    it('should be the same', () => {
      expect(part1('input/aoc11.txt')).toEqual(2469);
    });
  });

  describe('Part 2', () => {
    it('should be the same', () => {
      expect(part2('input/aoc11.txt')).toEqual('KLCZAEGU');
    });
  });
})