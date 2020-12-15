const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => readLines('input/2020/aoc12.txt').map(parse));

function parse(x) {
  const action = x.substring(0, 1);
  const value = Number(x.substring(1));
  return {
    action,
    value,
  };
}

const NESW = 'NESW';

const DIRECTIONS = {
  E: {
    axis: 'x',
    val: 1,
  },
  W: {
    axis: 'x',
    val: -1,
  },
  N: {
    axis: 'y',
    val: 1,
  },
  S: {
    axis: 'y',
    val: -1,
  },
};

function solveA(input) {
  let facing = 'E';
  let values = {
    x: 0,
    y: 0,
  };

  input.forEach((instruction) => {
    if (instruction.action === 'F') {
      values[DIRECTIONS[facing].axis] +=
        DIRECTIONS[facing].val * instruction.value;
    } else if (instruction.action === 'L') {
      const x = instruction.value / 90;
      const index = NESW.indexOf(facing);
      const temp = index - x;
      const newIndex = temp < 0 ? NESW.length + temp : temp % NESW.length;
      facing = NESW[newIndex];
    } else if (instruction.action === 'R') {
      const x = instruction.value / 90;
      const index = NESW.indexOf(facing);
      const newIndex = (index + x) % NESW.length;
      facing = NESW[newIndex];
    } else {
      values[DIRECTIONS[instruction.action].axis] +=
        DIRECTIONS[instruction.action].val * instruction.value;
    }
  });

  return Math.abs(values.x) + Math.abs(values.y);
}

function solveB(input) {
  let ship = {
    x: 0,
    y: 0,
  };
  let waypoint = {
    x: 10,
    y: 1,
  };

  input.forEach((instruction) => {
    if (instruction.action === 'F') {
      ship.x += instruction.value * waypoint.x;
      ship.y += instruction.value * waypoint.y;
    } else if (instruction.action === 'L') {
      const magic = (instruction.value / 90) % 4;
      const y = waypoint.y;
      const x = waypoint.x;
      if (magic === 1) {
        waypoint.x = y * -1;
        waypoint.y = x;
      } else if (magic === 2) {
        waypoint.x = x * -1;
        waypoint.y = y * -1;
      } else {
        waypoint.x = y;
        waypoint.y = x * -1;
      }
    } else if (instruction.action === 'R') {
      const magic = (instruction.value / 90) % 4;
      const y = waypoint.y;
      const x = waypoint.x;
      if (magic === 1) {
        waypoint.x = y;
        waypoint.y = x * -1;
      } else if (magic === 2) {
        waypoint.x = x * -1;
        waypoint.y = y * -1;
      } else {
        waypoint.x = y * -1;
        waypoint.y = x;
      }
    } else {
      waypoint[DIRECTIONS[instruction.action].axis] +=
        DIRECTIONS[instruction.action].val * instruction.value;
    }
  });
  return Math.abs(ship.x) + Math.abs(ship.y);
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
