const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

const passports = logTime('Parse', () =>
  parse(readLines('input/2020/aoc4.txt'))
);

const birthYear = 'byr';
const issueYear = 'iyr';
const expirationYear = 'eyr';
const height = 'hgt';
const hairColor = 'hcl';
const eyeColor = 'ecl';
const passportId = 'pid';
const countyId = 'cid';
const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const validHex = /^#[0-9A-Fa-f]{6}$/g;

function parse(lines) {
  const passports = [];
  let pp = {};
  lines.forEach((line) => {
    if (!line) {
      passports.push(pp);
      pp = {};
    } else {
      const l = line.split(' ');
      l.forEach((p) => {
        const param = p.split(':');
        pp[param[0]] = param[1];
      });
    }
  });
  passports.push(pp);
  return passports;
}

function isPassportValidA(passport) {
  return (
    passport[birthYear] &&
    passport[issueYear] &&
    passport[expirationYear] &&
    passport[height] &&
    passport[hairColor] &&
    passport[eyeColor] &&
    passport[passportId]
  );
}

function isValidBirthYear(b) {
  const by = Number(b);
  return b.length === 4 && by >= 1920 && Number(by) <= 2002;
}

function isValidIssueYear(i) {
  const iy = Number(i);
  return i.length === 4 && iy >= 2010 && iy <= 2020;
}

function isValidExpirationYear(e) {
  const ey = Number(e);
  return e.length === 4 && ey >= 2020 && ey <= 2030;
}

function isValidHeight(height) {
  if (height.replace('cm', '').length !== height.length) {
    const h = Number(height.replace('cm', ''));
    return h >= 150 && h <= 193;
  } else if (height.replace('in', '').length !== height.length) {
    const h = Number(height.replace('in', ''));
    return h >= 59 && h <= 76;
  }
  return false;
}

function isValidHairColor(hc) {
  return hc.match(validHex);
}

function isValidEyeColor(ec) {
  return validEyeColors.includes(ec);
}

function isValidPassportId(pid) {
  return pid.length === 9;
}

const validators = [
  isValidBirthYear,
  isValidIssueYear,
  isValidExpirationYear,
  isValidHeight,
  isValidHairColor,
  isValidEyeColor,
  isValidPassportId,
];

function isPassportValidB(passport) {
  if (!isPassportValidA(passport)) {
    return false;
  }
  return (
    isValidBirthYear(passport[birthYear]) &&
    isValidIssueYear(passport[issueYear]) &&
    isValidExpirationYear(passport[expirationYear]) &&
    isValidHeight(passport[height]) &&
    isValidHairColor(passport[hairColor]) &&
    isValidEyeColor(passport[eyeColor]) &&
    isValidPassportId(passport[passportId])
  );
}

function validatePassports(passports, isPassportValid) {
  return passports.filter(isPassportValid).length;
}

logTime('A', () => validatePassports(passports, isPassportValidA));
logTime('B', () => validatePassports(passports, isPassportValidB));
