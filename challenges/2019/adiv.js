const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_MAP = {};

ALPHABET.split('').forEach(letter => ALPHABET_MAP[letter] = letter.charCodeAt(0) - 64);

console.log(challenge2('MSIXWEKD'));
console.log(challenge2b('MVSLKOBF'));

function challenge2(input) {
  let result = '';

  input.split('').forEach(letter => {
    const startNumber = ALPHABET_MAP[letter];
  
    let n = startNumber - 7;
    let flow1 = Math.pow(n - 1 - 3, 6) * 8;
    let flow2 = (n * (n - 1)) * -1;
    let flow3 = Math.pow(n, 4) * -2;
  
    const sum = (flow1 + flow2 + flow3);
    const r = Math.floor(sum / 23);
    const x = r * 23;
    const y = sum - x;
    result += ALPHABET[y - 1];
  });
  return result;
}

function challenge2b(input) {
  const M = {};
  ALPHABET.split('').forEach(letter => {
    const x = challenge2(letter);
    if (!M[x]) {
      M[x] = letter;
    }
  });
  let result = ''
  input.split('').forEach(letter => result += M[letter]);
  return result;
}

