const { difference } = require('lodash');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => parse(readLines('input/2020/aoc16.txt')));

function parse(x) {
  const rules = {};
  const tickets = [];
  let yourTicket;
  for (let i = 0; i < x.length; i++) {
    if (x[i].length === 0) {
      rulsesFound = true;
      i += 2;
      yourTicket = x[i].split(',').map(Number);
      i += 2;
      for (let j = i + 1; j < x.length; j++) {
        tickets.push(x[j].split(',').map(Number));
      }
      break;
    } else {
      const rule = x[i].split(': ');
      rules[rule[0]] = rule[1]
        .split(' or ')
        .map((t) => t.split('-').map(Number));
    }
  }
  return {
    rules,
    yourTicket,
    tickets,
  };
}

function isRuleValid(ticketValue, rule) {
  return (
    (ticketValue >= rule[0][0] && ticketValue <= rule[0][1]) ||
    (ticketValue >= rule[1][0] && ticketValue <= rule[1][1])
  );
}

function isTicketValid(ticket, rules) {
  const invalidValues = [];
  ticket.forEach((ticketValue) => {
    if (
      rules.filter((rule) => !isRuleValid(ticketValue, rule)).length ===
      rules.length
    ) {
      invalidValues.push(ticketValue);
    }
  });
  return invalidValues;
}

function solveA(input) {
  return input.tickets
    .map((ticket) => {
      const result = isTicketValid(ticket, Object.values(input.rules));
      return result.reduce((acc, x) => acc + x, 0);
    })
    .reduce((acc, x) => acc + x, 0);
}

function solveB(input) {
  const validTickets = input.tickets.filter(
    (ticket) => isTicketValid(ticket, Object.values(input.rules)).length === 0
  );
  const notValidRules = {};
  const determinedRules = new Array(Object.keys(input.rules).length);
  Object.keys(input.rules).forEach((rule) => (notValidRules[rule] = []));
  let magicArray = [];
  input.yourTicket.forEach((x, i) => magicArray.push(i));
  do {
    validTickets.forEach((ticket) => {
      ticket.forEach((ticketValue, i) => {
        const invalidRules = Object.keys(input.rules).filter(
          (rule) => !isRuleValid(ticketValue, input.rules[rule])
        );
        if (invalidRules.length > 0) {
          invalidRules.forEach((notValidRule) => {
            if (!notValidRules[notValidRule].includes(i)) {
              notValidRules[notValidRule].push(i);
            }
          });
        }
      });
    });

    const rules = Object.keys(notValidRules);
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (
        notValidRules[rule].length ===
        input.yourTicket.length - 1 - determinedRules.filter((x) => !!x).length
      ) {
        const diff = difference(magicArray, notValidRules[rule]);
        determinedRules[diff[0]] = rule;
        magicArray = magicArray.filter((x) => x !== diff[0]);
        break;
      }
    }
    Object.keys(input.rules).forEach((rule) => (notValidRules[rule] = []));
  } while (
    Object.keys(determinedRules).length < Object.keys(input.rules).length
  );
  return determinedRules
    .map((rule, index) =>
      rule.includes('departure') ? input.yourTicket[index] : 1
    )
    .reduce((acc, x) => acc * x, 1);
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
