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

  terminate() {
    this.terminated = true;
  }

  run(x) {
    this.inputs.push(x);
  
    while (!this.terminated) {
      const instructionInfo = this._getParameterInfo(this.memory[this.i]);
      const { opcode, p1, p2 } = instructionInfo;
  
      if(opcode === 1) {
        this._add(p1, p2);
      } else if(opcode === 2) {
        this._multiply(p1, p2)
      } else if(opcode === 3) {
        this._set();
      } else if(opcode === 4) {
        this._setResult(p1);
        if (this.break) {
          break;
        }
      } else if(opcode === 5) {
        this._notEqualZeroPointer(p1, p2);
      } else if(opcode === 6) {
        this._equalZeroPointer(p1, p2);
      } else if(opcode === 7) {
        this._smallerThen(p1, p2);
      } else if(opcode === 8) {
        this._greaterThen(p1, p2);
      } else if (opcode === 99) {
        this.terminate();
      } else {
        throw new Error('Unknown opcode: ' + opcode);
      }      
    }
  
    return this.result;
  }

  _getParameter (parameterMode, position) {
    return parameterMode === 0
      ? this.memory[this.memory[position]]
      : this.memory[position];
  }

  _getParameterInfo(p) {
    const instruction = ('' + p).padStart(5, '0');
    const opcode = Number(instruction.substring(instruction.length - 2));
    const p1 = Number(instruction[instruction.length - 3]);
    const p2 = Number(instruction[instruction.length - 4]);
    const p3 = Number(instruction[instruction.length - 5]);
    return { opcode, p1, p2, p3 };
  }

  _add(parameterMode1, parameterMode2) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this.memory[this.i + 3];
    this.memory[output] = parameter1 + parameter2;
    this.i += 4
  }

  _multiply(parameterMode1, parameterMode2) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this.memory[this.i + 3];
    this.memory[output] = parameter1 * parameter2;
    this.i += 4
  }

  _set() {
    const output = this.memory[this.i + 1];
    const sh = this.inputs.shift();
    this.memory[output] = sh;
    this.i += 2
  }

  _setResult(parameterMode1) {
    const output = this._getParameter(parameterMode1, this.i + 1);
    this.result = output;
    this.i += 2;
  }

  _notEqualZeroPointer(parameterMode1, parameterMode2) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    this.i = (parameter1 !== 0 ? this._getParameter(parameterMode2, this.i + 2) : this.i + 3);
  }
  
  _equalZeroPointer(parameterMode1, parameterMode2) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    this.i = (parameter1 === 0 ? this._getParameter(parameterMode2, this.i + 2) : this.i + 3);
  }

  _smallerThen(parameterMode1, parameterMode2) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this.memory[this.i + 3];
    this.memory[output] = parameter1 < parameter2 ? 1 : 0;
    this.i += 4;
  }

  _greaterThen(parameterMode1, parameterMode2) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this.memory[this.i + 3];
    this.memory[output] = parameter1 === parameter2 ? 1 : 0;
    this.i += 4;
  }
}

module.exports = IntCodeRunner;

