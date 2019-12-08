const { part1, part2 } = require('../challenges/aoc7.js');

describe('Day 7', () => {
  it('should be the same', () => {
    expect(part1('input/aoc7.txt')).toBe(79723);
    expect(part2('input/aoc7.txt')).toBe(70602018);
  })
})