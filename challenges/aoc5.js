const { readLines } = require('../utils/readandwrite');

function run() {
  console.time('aoc5');

  const lines = readLines('input/aoc5.txt');
  const program = lines[0].split(',').map(x => Number(x));
  console.log(`Part #1: ${new IntCodeRunner(program, [], false).run(1)}`);
  console.log(`Part #2: ${new IntCodeRunner(program, []).run(5)}`);
  console.timeEnd('aoc5');
}

class IntCodeRunner {
  constructor(instructions, phase, b = true) {
    this.inputs = [...phase];
    this.memory = [...instructions];
    this.break = b;
    this.terminated = false;
    this.i = 0;
  }

  getParameter (parameterMode, position) {
    return parameterMode === 0
      ? this.memory[this.memory[position]]
      : this.memory[position];
  }

  getParameterInfo(p) {
    const instruction = ('' + p).padStart(5, '0');
    const opcode = Number(instruction.substring(instruction.length - 2));
    const p1 = Number(instruction[instruction.length - 3]);
    const p2 = Number(instruction[instruction.length - 4]);
    const p3 = Number(instruction[instruction.length - 5]);
    return { opcode, p1, p2, p3 };
  }

  run(x) {
    let res = null;
    this.inputs.push(x);
  
    while (!this.terminated) {
      const instructionInfo = this.getParameterInfo(this.memory[this.i]);
      const { opcode, p1, p2 } = instructionInfo;
  
      if(opcode === 1) {
        const i1 = this.getParameter(p1, this.i + 1);
        const i2 = this.getParameter(p2, this.i + 2);
        const output = this.memory[this.i + 3];
        this.memory[output] = i1 + i2;
        this.i += 4
      } else if(opcode === 2) {
        const i1 = this.getParameter(p1, this.i + 1);
        const i2 = this.getParameter(p2, this.i + 2);
        const output = this.memory[this.i + 3];
        this.memory[output] = i1 * i2;
        this.i += 4
      } else if(opcode === 3) {
        const output = this.memory[this.i + 1];
        const sh = this.inputs.shift();
        this.memory[output] = sh;
        this.i += 2
      } else if(opcode === 4) {
        const output = this.getParameter(p1, this.i + 1);
        res = output;
        this.i += 2;
        if (this.break) {
          break;
        }
      } else if(opcode === 5) {
        const i1 = this.getParameter(p1, this.i + 1);
  
        if (i1 !== 0) {
          const i2 = this.getParameter(p2, this.i + 2);

          this.i = i2;
        } else {
          this.i += 3
        }
      } else if(opcode === 6) {
        const i1 = this.getParameter(p1, this.i + 1);
  
        if (i1 === 0) {
          const i2 = this.getParameter(p2, this.i + 2);
  
          this.i = i2;
        } else {
          this.i += 3
        }
      } else if(opcode === 7) {
        const i1 = this.getParameter(p1, this.i + 1);
        const i2 = this.getParameter(p2, this.i + 2);
        const output = this.memory[this.i + 3];
        this.memory[output] = i1 < i2 ? 1 : 0;
        this.i += 4;
      } else if(opcode === 8) {
        const i1 = this.getParameter(p1, this.i + 1);
        const i2 = this.getParameter(p2, this.i + 2);
        const output = this.memory[this.i + 3];
        this.memory[output] = i1 === i2 ? 1 : 0;
        this.i += 4;
      } else if (opcode === 99) {
        this.terminated = true;
      } else {
        throw new Error('Unknown opcode: ' + opcode);
      }      
    }
  
    return res;
  }
}

run();

module.exports = IntCodeRunner;

