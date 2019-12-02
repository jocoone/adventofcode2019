const fs = require('fs');
const path = require('path');

function readFile(file) {
  const p = path.join(`${process.cwd()}/${file}`);
  return fs.readFileSync(p, 'utf-8');
}

function readLines(file) {
  return readFile(file).split('\n');
}

function write(lines, file) {
  fs.unlink(file, (err) => {
    if (!err) console.log(file + ' was deleted!');
    let result = '';
    lines.forEach(line => result += line);
    fs.writeFileSync(file, result, { flag: 'w' })
  });
  
}

module.exports = { readFile, readLines, write };