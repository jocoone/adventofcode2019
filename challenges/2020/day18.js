const parallel = require('run-parallel');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => readLines('input/2020/aoc18.txt'));

function parse(x) {}

const operators = {
  '*': (n1, n2) => n1 * n2,
  '+': (n1, n2) => n1 + n2,
};

function solveSimpleWithoutPrecedence(line) {
  let expression = line.split(' ');
  do {
    const num1 = Number(expression[0]);
    const operator = expression[1];
    const num2 = Number(expression[2]);
    const result = operators[operator](num1, num2);
    expression.splice(0, 3, result);
  } while (expression.length > 1);
  return expression[0];
}

function solveSimpleWithPrecedence(line) {
  let expression = line;
  const regex = new RegExp(/\d+ \+ \d+/);
  const multRegex = new RegExp(/\d+ \* \d+/);
  let match = expression.match(regex);
  while (match) {
    match.forEach((el) => {
      const split = el.split(' + ');
      expression = expression.replace(el, Number(split[0]) + Number(split[1]));
    });
    match = expression.match(regex);
  }
  const multMatch = expression.match(multRegex);
  if (multMatch) {
    const split = expression.split(' * ');
    return split.map(Number).reduce((acc, x) => acc * x, 1);
  }
  return Number(expression);
}

function solve(line, solveSimple) {
  let expression = line;
  const regex = new RegExp(/\(((?!(\(|\))).)*\)/g);
  do {
    const match = expression.match(regex);
    if (match) {
      match.forEach((exp) => {
        const x = exp.replace(/\(/g, '').replace(')', '');
        expression = expression.replace(`(${x})`, solveSimple(x));
      });
    }
  } while (expression.includes('('));
  return solveSimple(expression);
}

function solveA(input) {
  return input
    .map((line) => solve(line, solveSimpleWithoutPrecedence))
    .reduce((acc, x) => acc + x, 0);
}

function solveB(input) {
  return input
    .map((line) => solve(line, solveSimpleWithPrecedence))
    .reduce((acc, x) => acc + x, 0);
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
