const { readLines } = require('../utils/readandwrite');
const { mapKeys } = require('lodash');

const lines = readLines('input/test2.txt');
const linesProgram = readLines('input/test2program.txt');

const operations = {
  'addr': (registers, a, b, c) => {
    const result = [...registers];
    result[c] = result[a] + result[b]
    return result;
  },
  'addi': (registers, a, b, c) => {
    const result = [...registers];
    result[c] = result[a] + b
    return result;
  },
  'mulr': (registers, a, b, c) => {
    const result = [...registers];
    result[c] = result[a] * result[b]
    return result;
  },
  'muli': (registers, a, b, c) => {
    const result = [...registers];
    result[c] = result[a] * b
    return result;
  },
  'banr': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = result[a] & result[b]
    return result;
  },
  'bani': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = result[a] & b
    return result;
  },
  'borr': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = result[a] | result[b]
    return result;
  },
  'bori': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = result[a] | b
    return result;
  },
  'setr': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = result[a]
    return result;
  },
  'seti': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = a
    return result;
  },
  'gtir': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = (a > result[b] ? 1 : 0)
    return result;
  },
  'gtri': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = (result[a] > b ? 1 : 0)
    return result;
  },
  'gtrr': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = (result[a] > result[b] ? 1 : 0)
    return result;
  },
  'eqir': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = (a === result[b] ? 1 : 0)
    return result;
  },
  'eqri': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = (result[a] === b ? 1 : 0)
    return result;
  },
  'eqrr': (registers, a, b, c) => {
    const result = [...registers];
    
    result[c] = (result[a] === result[b] ? 1 : 0)
    return result;
  },
}


function calculate() {
  let numOf3PlusOps = 0;
  for (let i = 0; i <lines.length; i = i + 4) {

    const line = lines[i];
    const line2 = lines[i+1];
    const line3 = lines[i+2];
    
    const registers = /^Before:\s+\[(.*)\]$/.exec(line)[1].split(', ').map(x => parseInt(x));
    const ops = line2.split(' ').map(x => parseInt(x));
    const opcode = ops[0];
    const a = ops[1];
    const b = ops[2];
    const c = ops[3];
    const endRegisters = /^After:\s+\[(.*)\]$/.exec(line3)[1].replace(/\s/g, '');
    let match = 0;

    const oplist = Object.keys(operations);
    for (let j = 0; j < oplist.length; j = j + 1) {
      if ('' + operations[oplist[j]]([...registers], a, b, c) === endRegisters) {
        match = match + 1;
      }
      if (match >= 3) {
        numOf3PlusOps = numOf3PlusOps + 1;
        break;
      }
    }
  }
  return numOf3PlusOps;
}

function calculate2() {
  const resolvedOpCodes = {};
  const xxx = [];
  do {
    let filteredOperations = Object.keys(operations);
  
    for (let i = 0; i <lines.length; i = i + 4) {
      const line = lines[i];
      const line2 = lines[i+1];
      const line3 = lines[i+2];
      
      const registers = /^Before:\s+\[(.*)\]$/.exec(line)[1].split(', ').map(x => parseInt(x));
      const ops = line2.split(' ').map(x => parseInt(x));
      const opcode = ops[0];
      const a = ops[1];
      const b = ops[2];
      const c = ops[3];
      const endRegisters = /^After:\s+\[(.*)\]$/.exec(line3)[1].replace(/\s/g, '');
      let match = 0;
  
      const posibilities = [];

      filteredOperations.forEach(op => {
        if (!resolvedOpCodes['' + opcode] && '' + operations[op]([...registers], a, b, c) === endRegisters) {
          match = match + 1;
          posibilities.push(op);
        }
      });

      if (!resolvedOpCodes['' + opcode] && posibilities.length === 1) {
        resolvedOpCodes['' + opcode] = posibilities[0];
        xxx.push(opcode);
      }
      const mappedOpCodes = mapKeys(resolvedOpCodes, (value) => value);
      filteredOperations = filteredOperations.filter(key => !mappedOpCodes[key]);
    }
  } while (xxx.length < 12);
  return resolvedOpCodes;
}


console.log('Num of samples with 3 or plus correct opcodes: ' + calculate());
const resOpCodes = calculate2();
console.log(resOpCodes);
let registers = [0, 0, 0, 0];

linesProgram.forEach(line => {
  const ops = line.split(' ').map(x => parseInt(x));
  const operation = resOpCodes[ops[0]];
  registers = operations['' + operation]([...registers], ops[1], ops[2], ops[3]);
});

console.log(registers);





