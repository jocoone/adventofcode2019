const { template, includes } = require('lodash');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const lines = readLines('input/2020/aoc19.txt');

const i = logTime('Parse 1', () => parse(lines));
const i2 = logTime('Parse 2', () =>
  parse(lines, (tempRules) => {
    tempRules['8'] = [['42+']];
    tempRules['11'] = [['42'], ['42', '8']];
  })
);

function parseValue(v, rules) {
  if (!Array.isArray(v)) {
    return v;
  }
  return v
    .map((vv) => {
      if (Array.isArray(rules[vv]) && rules[vv].includes(vv)) {
        return `(${rules[vv]
          .filter((vvv) => vvv != vv)
          .map((vvv) => `${parseValue(vvv, rules)}+`)
          .join('|')})`;
      }
      if (Array.isArray(rules[vv]) && !rules[vv].includes(vv)) {
        return `(${rules[vv].map((vvv) => parseValue(vvv, rules)).join('|')})`;
      }

      return rules[vv];
    })
    .join('');
}

function parseRule(rule, rules) {
  return rule.map((el) => parseValue(el, rules)).join('|');
}

function parse(x, change = () => {}) {
  const tempRules = {};
  let imagesIndex = 0;
  for (let i = 0; i < x.length; i++) {
    if (!x[i]) {
      imagesIndex = i + 1;
      break;
    }
    const rule = x[i].split(': ');
    const ruleNumber = rule[0];
    tempRules[ruleNumber] = rule[1].includes('"')
      ? rule[1].replace(/"/g, '')
      : rule[1].split(' | ').map((o) => o.split(' '));
  }
  change(tempRules);
  const rules = {};
  Object.keys(tempRules).forEach((key) => {
    const rule = tempRules[key];
    if (Array.isArray(rule)) {
      rules[key] = parseRule(rule, tempRules);
    }
  });
  return {
    rules,
    input: x.slice(imagesIndex),
  };
}

function solveA({ input, rules }) {
  const regex = new RegExp(`^${rules[0]}$`);
  return input.filter((line) => line.match(regex)).length;
}

function solveB(input) {}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i2));
