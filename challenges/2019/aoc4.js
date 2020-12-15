const { uniq, values } = require('lodash');

console.time('aoc4');

const lowerRange = 231832;
const upperRange = 767346;

function charCount(p) {
  const s = '' + p;
  const result = {};
  s.split('').forEach(c => {
    if (result[c]) {
      result[c] = result[c] + 1
    } else {
      result[c] = 1;
    }
  })
  return result;
}

function calculatePasswords(low, high) {
  const lowest = '' + low;
  const highest = '' + high;
  const possiblePasswords = []
  for (let i = parseInt(lowest[0]); i < parseInt(highest[0]) + 1; i++) {
    for (let j = i; j < 10; j++) {
      for (let k = j; k < 10; k++) {
        for (let l = k; l < 10; l++) {
          for (let m = l; m < 10; m++) {
            for (let n = m; n < 10; n++) {
              const password = '' + i + j + k + l + m + n;
              const highRule = i <= j && j <= k && k <= l && l <= m && m <= n;
              if (highRule) {
                const uniqueChars = uniq(password.split(''));
                const sameRule = uniqueChars.length == 5;
                const c = charCount(password);
                if(values(c).includes(2)) {
                  const p = parseInt(password);
                  if (p < high && p > low) {
                    possiblePasswords.push(password);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return possiblePasswords;
}

const possiblePasswords = calculatePasswords(lowerRange, upperRange)

console.log(`Possible passwords = ${possiblePasswords}`)
console.log(`Possible number of passwords = ${possiblePasswords.length}`);

console.timeEnd('aoc4');
