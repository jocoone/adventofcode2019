const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const policies = readLines('input/2020/aoc2.txt').map(parse);

function parse(policy) {
  const s1 = policy.split(' ');
  const password = s1[2];
  const letter = s1[1].replace(':', '');
  const s2 = s1[0].split('-');
  const a = Number(s2[0]);
  const b = Number(s2[1]);
  return {
    password,
    letter,
    a,
    b,
  };
}

function isValidSled(policy) {
  const { password, letter, a, b } = policy;

  const regex = new RegExp(letter, 'g');
  const filteredPassword = password.replace(regex, '');
  const validation = password.length - filteredPassword.length;
  return validation >= a && validation <= b;
}

function isValidTobogan(policy) {
  const { password, letter, a, b } = policy;
  return (
    (password[a - 1] === letter && password[b - 1] !== letter) ||
    (password[a - 1] !== letter && password[b - 1] === letter)
  );
}

function findCorrectPolicies(policies, isValid) {
  return policies.filter(isValid).length;
}

logTime('A', () => findCorrectPolicies(policies, isValidSled));
logTime('B', () => findCorrectPolicies(policies, isValidTobogan));
