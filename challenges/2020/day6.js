const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');
const union = require('lodash/union');

const answers = logTime('Parse', () => parse(readLines('input/2020/aoc6.txt')));

function parse(answers) {
  const groups = [];
  let group = [];
  answers.forEach((line) => {
    if (!line) {
      groups.push(group);
      group = [];
    } else {
      group.push(line);
    }
  });
  groups.push(group);
  return groups;
}

function getNumberCount(groups) {
  return groups.reduce((acc, group) => {
    return acc + union(...group.map((p) => p.split(''))).length;
  }, 0);
}

function getEveryYes(groups) {
  return groups.reduce((acc, group) => {
    const groupSize = group.length;
    const allAnswers = group.join('').split('');
    const answerMap = {};
    allAnswers.forEach((answer) => {
      if (!answerMap[answer]) {
        answerMap[answer] = 1;
      } else {
        answerMap[answer] = answerMap[answer] + 1;
      }
    });
    return acc + Object.values(answerMap).filter((v) => v === groupSize).length;
  }, 0);
}

logTime('A', () => getNumberCount(answers));
logTime('B', () => getEveryYes(answers));
