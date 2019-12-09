const { readLines } = require('../utils/readandwrite');

function run() {
  console.time('aoc5');

  const lines = readLines('input/aoc5.txt');
  const program = lines[0].split(',').map(Number);
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
    this.relativeBase = 0;
    this.result = [];
    this.opcodes = {
      1: this._add.bind(this),
      2: this._multiply.bind(this),
      3: this._set.bind(this),
      4: this._setResult.bind(this),
      5: this._notEqualZeroPointer.bind(this),
      6: this._equalZeroPointer.bind(this),
      7: this._smallerThen.bind(this),
      8: this._equals.bind(this),
      9: this._setRelativeBase.bind(this),
      99: this.terminate.bind(this),
    }
  }

  enlargeMemory() {
    for (let i = 0; i < 50000; i++) {
      this.memory.push(0);
    }
  }

  terminate() {
    this.terminated = true;
  }

  run(x) {
    this.inputs.push(x);
  
    while (!this.terminated) {
      const instructionInfo = this._getParameterInfo(this.memory[this.i]);
      const { opcode, p1, p2, p3 } = instructionInfo;
  
      if (this.opcodes[opcode]) {
        this.opcodes[opcode](p1, p2, p3);

        if(opcode === 4 && this.break) {
          break;
        }
      }     
    }
  
    return this.result;
  }

  _getParameter (parameterMode, position) {
    if (parameterMode === 0) {
      return this.memory[this.memory[position]];
    } else if (parameterMode === 1) {
      return this.memory[position]
    } else if (parameterMode === 2) {
      return this.memory[this.memory[position] + this.relativeBase];
    }
  }

  _getAddress(parameterMode, position) {
    if (parameterMode === 0) {
      return this.memory[position];
    } else if (parameterMode === 2) {
      return this.memory[position] + this.relativeBase;
    }
  }

  _getParameterInfo(p) {
    const instruction = ('' + p).padStart(5, '0');
    return { 
      opcode: Number(instruction.substring(instruction.length - 2)), 
      p1: Number(instruction[instruction.length - 3]), 
      p2: Number(instruction[instruction.length - 4]),
      p3: Number(instruction[instruction.length - 5])
    };
  }

  _add(parameterMode1, parameterMode2, parameterMode3) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this._getAddress(parameterMode3, this.i + 3);
    this.memory[output] = parameter1 + parameter2;
    this.i += 4
  }

  _multiply(parameterMode1, parameterMode2, parameterMode3) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this._getAddress(parameterMode3, this.i + 3);
    this.memory[output] = parameter1 * parameter2;
    this.i += 4
  }

  _set(parameterMode1) {
    const output = this._getAddress(parameterMode1, this.i + 1);
    const sh = this.inputs.shift();
    this.memory[output] = sh;
    this.i += 2
  }

  _setResult(parameterMode1) {
    const output = this._getParameter(parameterMode1, this.i + 1);
    this.result.push(output);
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

  _smallerThen(parameterMode1, parameterMode2, parameterMode3) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this._getAddress(parameterMode3, this.i + 3);
    this.memory[output] = parameter1 < parameter2 ? 1 : 0;
    this.i += 4;
  }

  _equals(parameterMode1, parameterMode2, parameterMode3) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    const parameter2 = this._getParameter(parameterMode2, this.i + 2);
    const output = this._getAddress(parameterMode3, this.i + 3);
    this.memory[output] = parameter1 === parameter2 ? 1 : 0;
    this.i += 4;
  }

  _setRelativeBase(parameterMode1) {
    const parameter1 = this._getParameter(parameterMode1, this.i + 1);
    this.relativeBase += parameter1;
    this.i += 2;
  }
}

module.exports = IntCodeRunner;

