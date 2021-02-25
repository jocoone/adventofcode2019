const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const i = logTime('Parse', () => parse(readLines('input/2020/aoc23.txt')));

function parse(x) {
  return x[0].split('').map(Number);
}

function gameOfCrabs(cups, moves) {
  cups = cups.map((value) => ({ value }));
  cups.forEach(
    (cup, i) => (cup.next = i < cups.length - 1 ? cups[i + 1] : cups[0])
  );
  const map = new Map(cups.map((item) => [item.value, item]));
  let currentCup = cups[0];

  for (let move = 0; move < moves; move++) {
    const cupsTaken = [
      currentCup.next.value,
      currentCup.next.next.value,
      currentCup.next.next.next.value,
    ];
    const newHead = currentCup.next;
    currentCup.next = currentCup.next.next.next.next;

    let current = currentCup.value - 1;
    while (true) {
      while (cupsTaken.includes(current)) current--;
      if (current === 0) current += cups.length;
      while (cupsTaken.includes(current)) current--;

      const position = map.get(current);
      if (position) {
        newHead.next.next.next = position.next;
        position.next = newHead;
        break;
      }

      current--;
    }

    currentCup = currentCup.next;
  }
  return map;
}

function solveA(cups) {
  const map = gameOfCrabs(cups, 100, 9);
  let result = '';
  let head = map.get(1);
  do {
    result += head.value;
    head = head.next;
  } while (head.value !== 1);
  return result;
}

function solveB(cups) {
  for (let i = Math.max(...cups) + 1; i <= 1000000; i++) {
    cups.push(i);
  }
  const result = gameOfCrabs(cups, 10000000, 1000000);
  return result.get(1).next.value * result.get(1).next.next.value;
}

logTime('A', () => solveA([...i]));
logTime('B', () => solveB([...i]));
