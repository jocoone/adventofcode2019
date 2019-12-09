const { part1, part2 } = require('../challenges/aoc9.js');

describe('Day 9', () => {
  describe('Part 1', () => {
    it('should be the same', () => {
      expect(part1('input/aoc9.txt')).toEqual([3512778005]);
      expect(part1('input/aoc9test.txt', null)).toEqual([109]);
      expect(part1('input/aoc9test2.txt', null)).toEqual([1219070632396864]);
      expect(part1('input/aoc9test3.txt', null)).toEqual([1125899906842624]);
      expect(part1('input/axxes.txt', 1, false)).toEqual([ 65, 120, 120, 101, 115, 32, 114, 117, 108, 101, 115, 33 ]);
    });
  });

  describe('Part 2', () => {
    it('should be the same', () => {
      expect(part2('input/aoc9.txt')).toEqual([35920]);
    });
  });
})