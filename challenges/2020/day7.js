const { find } = require('lodash');
const { count } = require('yargs');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const rules = logTime('Parse', () =>
  readLines('input/2020/aoc7.txt').map(parse)
);

function parse(rule) {
  const split = rule.split(/bags?/g);
  const bag = split[0].trim();
  const contents = [];
  for (let i = 1; i < split.length; i++) {
    const text = split[i].trim().replace('contain ', '').replace(', ', '');
    const match = text.match(/^(\d) (.*)$/);
    if (match) {
      contents.push({
        quantity: Number(match[1]),
        color: match[2],
      });
    }
  }
  return {
    bag,
    contents,
  };
}

function findColor(rules, contents, color) {
  if (contents.includes(color)) {
    return true;
  }
  for (let i = 0; i < contents.length; i++) {
    if (findColor(rules, rules[contents[i]], color)) {
      return true;
    }
  }
  return false;
}

function containsColor(rules) {
  let count = 0;
  const bags = Object.keys(rules);
  for (let i = 0; i < bags.length; i++) {
    if (findColor(rules, rules[bags[i]], 'shiny gold')) {
      count++;
    }
  }
  return count;
}

function getShinyGoldBag(rules) {
  const optimizedRules = {};
  rules.forEach(
    (rule) => (optimizedRules[rule.bag] = rule.contents.map((r) => r.color))
  );

  return containsColor(optimizedRules);
}

function countRecursiveBags(rules, contents, count) {
  if (contents.length === 0) {
    return 1;
  }
  return (
    count +
    contents
      .map((c) => c.quantity * countRecursiveBags(rules, rules[c.color], count))
      .reduce((acc, x) => acc + x, 0)
  );
}

function countBags(rules) {
  const optimizedRules = {};
  rules.forEach((rule) => (optimizedRules[rule.bag] = rule.contents));
  return (
    countRecursiveBags(optimizedRules, optimizedRules['shiny gold'], 1) - 1
  );
}

logTime('A', () => getShinyGoldBag(rules));
logTime('B', () => countBags(rules));
