const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const { player1, player2 } = logTime('Parse', () =>
  parse(readLines('input/2020/aoc22.txt'))
);

function parse(x) {
  const player1 = [];
  const player2 = [];

  let p1 = true;
  for (let i = 1; i < x.length; i++) {
    let line = x[i];
    if (!line) {
      i++;
      p1 = false;
      continue;
    }
    if (p1) {
      player1.push(Number(line));
    } else {
      player2.push(Number(line));
    }
  }

  player1.reverse();
  player2.reverse();

  return {
    player1,
    player2,
  };
}

function solveA({ player1, player2 }) {
  let rounds = 0;
  do {
    const card1 = player1.pop();
    const card2 = player2.pop();
    if (card1 > card2) {
      player1.unshift(card2, card1);
    }
    if (card2 > card1) {
      player2.unshift(card1, card2);
    }
    rounds++;
    //console.log('p1: ', player1.join(', '));
    //console.log('p2: ', player2.join(', '));
    //console.log('------------');
  } while (player1.length > 0 && player2.length > 0);

  const winningPlayer = player1.length === 0 ? player2 : player1;
  return winningPlayer.reduce((acc, value, index) => {
    return acc + value * (index + 1);
  }, 0);
}

const cache = {};

function recursiveCombat(player1, player2) {
  let previousRounds = new Set();
  let round = 1;
  do {
    //console.log(`--- Round ${round} ---`);
    //console.log('player 1: ', player1.reverse().join(', '));
    //console.log('player 2: ', player2.reverse().join(', '));
    //player1.reverse();
    //player2.reverse();

    const card1 = player1.pop();
    const card2 = player2.pop();

    //console.log('player 1 plays:', card1);
    //console.log('player 2 plays:', card2);

    if (player1.length >= card1 && player2.length >= card2) {
      const p1 = [...player1].slice(player1.length - card1);
      const p2 = [...player2].slice(player2.length - card2);
      const id = `${p1.join(',')} - ${p2.join(',')}`;
      const winning = cache[id] ? cache[id] : recursiveCombat(p1, p2);
      if (winning === 1) {
        player1.unshift(card2, card1);
      } else {
        player2.unshift(card1, card2);
      }
      cache[id] = winning;
    } else {
      if (card1 > card2) {
        //console.log('Player 1 wins');
        player1.unshift(card2, card1);
      } else if (card2 > card1) {
        //console.log('Player 2 wins');
        player2.unshift(card1, card2);
      }
    }
    if (previousRounds.has(`${player1.join(',')}-${player2.join(',')}`)) {
      //console.log('willy');
      return 1;
    }
    previousRounds.add(`${player1.join(',')}-${player2.join(',')}`);

    round++;
    //console.log('');
  } while (player1.length > 0 && player2.length > 0);

  return player1.length === 0 ? 2 : 1;
}

function solveB({ player1, player2 }) {
  const winningPlayer =
    recursiveCombat(player1, player2) === 1 ? player1 : player2;
  return winningPlayer.reduce((acc, value, index) => {
    return acc + value * (index + 1);
  }, 0);
}

logTime('A', () => solveA({ player1: [...player1], player2: [...player2] }));
logTime('B', () => solveB({ player1: [...player1], player2: [...player2] }));
