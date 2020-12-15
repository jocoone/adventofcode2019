const { readLines } = require('../utils/readandwrite');
const { countBy } = require('lodash');

function createLayers(imageData, width, height) {
  const layers = [];
  let layer = [];
  for (let i = 0; i < imageData.length; i++) {
    layer.push(imageData[i]);
    if ((i + 1) % (width * height) === 0) {
      layers.push(layer);
      layer = []
    }
  }
  return layers;
}

function part1(input, width, height) {
  console.time('aoc8p1');
  const imageData = readLines(input)[0].split('');
  
  console.log('number of layers = ' + (imageData.length / (width * height)))
  const layers = createLayers(imageData, width, height);
  let resultLayer = layers[0];
  let resultLayerZeros = 1000000;
  layers.forEach(layer => {
    const zeros = countBy(layer, x => x)['0'];
    if (resultLayerZeros > zeros) {
      resultLayer = layer;
      resultLayerZeros = zeros;
    }
  });
  const count = countBy(resultLayer, x => x);
  const ones = count['1'];
  const twos = count['2'];
  console.timeEnd('aoc8p1');
  return ones * twos;
}

function part2(input, width, height) {
  console.time('aoc8p2');
  const imageData = readLines(input)[0].split('');
  const layers = createLayers(imageData, width, height);
  const result = [];
  for (let i = 0; i < layers[0].length; i++) {
    const pixels = layers.map(x => x[i]).filter(x => x != 2);
    result.push(pixels[0] == 1 ? 'x' : ' ');
  }
  let row = ''
  let x = 1;
  for (let i = 0; i < result.length; i++) {
    row += result[i];
    if (x === width) {
      row += '\n';
      x = 0;
    }
    x++;
  }
  console.timeEnd('aoc8p2');
  return row;
}

module.exports = {
  part1, part2
};


