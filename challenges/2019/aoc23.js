const { readLines } = require('../utils/readandwrite');
const { uniq } = require('lodash');
const IntCodeComputer = require('../common/icc');


function part1(file) {
    console.time('aoc23p1');
    const program = readLines(file)[0].split(',').map(Number);

    let result;
    let specialPacket = false;

    let network = {};

    function input(address) {
      return () => {
        if (!network[address].addressSend) {
          network[address].addressSend = true;
          return address;
        }
        if (network[address].queue.length === 0) return -1;
        else return network[address].queue.shift();
      };
    }

    function output(res, value)  {
      if (res.length === 1) {
        if (value === 255) {
          specialPacket = true;
        }
      } else {
        if (specialPacket) {
          if (res.length === 3) {
            result = value;
          }
        }
        if (res.length === 3) {
          const address = res.shift();
          if (address < 50) {
            const x = res.shift();
            const y = res.shift();
            network[address].queue.push(x, y);
          }
        }
      }
    }

    function breakSignal(value, opcode) {
      if (!!value && opcode === 3) {
        return true;
      }
      return false;
    }

    for(let i = 0; i < 50; i++) {
      network[i] =  { addressSend: false, queue : [], computer: new IntCodeComputer(program, [], 0, output, input(i), false, breakSignal)};
    }

    while(!result) {
      for (let i = 0; i < 50; i++) {
        network[i].computer.run();
      }
    }

    console.timeEnd('aoc23p1');
    return result;
  }


class NAT {
  constructor(cb) {
    this.x = -1;
    this.y = -1;
    this.retrieved = false;
    this.doWhenIdle = () => {
      if (this.retrieved) {
        this.retrieved = false;
        cb(this.x, this.y)
      }
    };
  }

  push(x,y) {
    this.x = x;
    this.y = y;
    this.retrieved = true;
  }
}

  function part2(file) {
    console.time('aoc23p2');
    const program = readLines(file)[0].split(',').map(Number);
  
    let result = new Set();
    let res;

    let network = {
      255: { queue: new NAT((x, y) => {
        network[0].queue.push(x, y);
        if (result.has(y)) {
          res = y;
        }
        result.add(y);
      })}
    };

    function input(address) {
      return () => {
        if (!network[address].addressSend) {
          network[address].addressSend = true;
          return address;
        }
        if (network[address].queue.length === 0) return -1;
        else return network[address].queue.shift();
      };
    }

    function output(res, value)  {
      if (res.length === 3) {
        const address = res.shift();
        const x = res.shift();
        const y = res.shift();
        network[address].queue.push(x, y);
      }
    }

    function breakSignal(value, opcode) {
      if (!!value && opcode === 3) {
        return true;
      }
      return false;
    }

    for(let i = 0; i < 50; i++) {
      network[i] =  { queue : [], computer: new IntCodeComputer(program, [], 0, output, input(i), false, breakSignal)};
    }

    while(!res) {
      for (let i = 0; i < 50; i++) {
        network[i].computer.run();
      }
      const queueSizes = Object.keys(network).filter(k => k !== '255').map(k => network[k].queue.length).reduce((a, b) => a + b)
      if (queueSizes === 0) {
        network[255].queue.doWhenIdle();
      }
    }

    console.timeEnd('aoc23p2');
    return res;
  }

  console.log(`Part #1: ${part1('input/aoc23.txt')}`);
  console.log(`Part #2: ${part2('input/aoc23.txt')}`);
  
  module.exports = {
    part1, part2
  };