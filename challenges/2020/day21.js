const { uniq } = require('lodash');
const { readLines } = require('../../utils/readandwrite');
const { logTime } = require('../../utils/util');

class Food {
  constructor(ingredients, allergens) {
    this.ingredients = ingredients;
    this.allergenes = allergens;
  }
}

const i = logTime('Parse', () => readLines('input/2020/aoc21.txt').map(parse));

function parse(x) {
  const split = x.split(' (contains ');
  const ingredients = split[0].split(' ');
  const allergens = split[1].replace(')', '').split(', ');
  return new Food(ingredients, allergens);
}

function prepare(foods) {
  const allergenes = {};
  foods.forEach((food) => {
    food.allergenes.forEach((allergene) => {
      if (!allergenes[allergene]) {
        allergenes[allergene] = [...food.ingredients];
      } else {
        allergenes[allergene] = allergenes[allergene].filter((ing) =>
          food.ingredients.includes(ing)
        );
      }
    });
  });
  const ingredients = new Set();
  Object.values(allergenes).forEach((ing) => {
    ing.forEach((ingredient) => {
      ingredients.add(ingredient);
    });
  });
  return { ingredients, allergenes };
}

function solveA(foods) {
  const { ingredients } = prepare(foods);
  let sum = 0;
  foods.forEach((food) => {
    sum += food.ingredients.length;
    ingredients.forEach((allergen) => {
      if (food.ingredients.includes(allergen)) sum--;
    });
  });
  return sum;
}

function solveB(foods) {
  const { allergenes } = prepare(foods);
  const found = {};

  do {
    Object.keys(allergenes)
      .filter((allergene) => allergenes[allergene].length === 1)
      .forEach((allergene) => {
        found[allergene] = allergenes[allergene][0];
      });
    Object.keys(allergenes).forEach((allergene) => {
      allergenes[allergene] = allergenes[allergene].filter(
        (ing) => !Object.values(found).includes(ing)
      );
    });
  } while (Object.keys(found).length !== Object.keys(allergenes).length);

  return Object.keys(found)
    .sort()
    .map((all) => found[all])
    .join(',');
}

logTime('A', () => solveA(i));
logTime('B', () => solveB(i));
