const { part1, part2 } = require('../challenges/aoc8.js');

describe('Day 8', () => {
  describe('Part 1', () => {
    it('should be the same', () => {
      expect(part1('input/aoc8.txt', 25, 6)).toBe(1330);
    });
  });

  describe('Part 2', () => {
    it('should be the same', () => {
      //expect(part2('input/aoc8test.txt', 2, 2)).toBe(' x\nx \n');
      const result = part2('input/aoc8.txt', 25, 6)
      expect(result).toBe(
        'xxxx  xx  x  x xxxx xxxx \n' + 
        'x    x  x x  x x    x    \n' +
        'xxx  x  x xxxx xxx  xxx  \n' +
        'x    xxxx x  x x    x    \n' +
        'x    x  x x  x x    x    \n' +
        'x    x  x x  x xxxx x    \n')
      ;
    });
  });
})