const { readLines, write } = require('../utils/readandwrite');

const file = 'b';

function parse(lines) {
  const lineOne = lines[0].split(' ').map(Number);
  const simulationDuration = lineOne[0];
  const numberofInterSections = lineOne[1];
  const numberofStreets = lineOne[2];
  const numberOfCars = lineOne[3];
  const bonusPoints = lineOne[4];

  const streets = [];
  const cars = [];
  for (let i = 1; i <= numberofStreets; i++) {
    const street = Street.parse(lines[i]);
    streets.push(street);
  }

  for (
    let i = 1 + numberofStreets;
    i < 1 + numberofStreets + numberOfCars;
    i++
  ) {
    cars.push(Car.parse(lines[i]));
  }

  const intersections = {};

  cars.forEach((car) => {
    const street = streets.find((s) => s.name === car.path[0]);
    if (street) {
      street.queue.push(car);
    }
    car.path.pop();
    car.path.forEach((s) => {
      const carStreet = streets.find((ss) => ss.name === s);
      if (carStreet) {
        if (
          intersections[carStreet.end] &&
          !intersections[carStreet.end].find((x) => x.name === s)
        ) {
          intersections[carStreet.end].push(carStreet);
        } else {
          intersections[carStreet.end] = [carStreet];
        }
      }
    });
  });

  return {
    streets,
    cars,
    intersections,
    simulationDuration,
  };
}

class Street {
  constructor(name, duration, start, end) {
    this.name = name;
    this.duration = duration;
    this.start = start;
    this.end = end;
    this.queue = [];
  }

  static parse(line) {
    const split = line.split(' ');
    return new Street(
      split[2],
      Number(split[3]),
      Number(split[0]),
      Number(split[1])
    );
  }
}

class Intersection {
  constructor(id, incomingStreets) {
    this.id = id;
    this.incomingStreets = incomingStreets;
  }
}

class Output {
  constructor(intersection, numberOfStreets, streets) {
    this.intersection = intersection;
    this.numberOfStreets = numberOfStreets;
    this.streets = streets;
  }

  output() {
    return `${this.intersection}
${this.numberOfStreets}
${streets.map((s) => s.name + ' ' + 1)}\n`;
  }
}

class Car {
  constructor(pathLength, path) {
    this.pathLength = pathLength;
    this.path = path;
  }

  static parse(line) {
    const [pathLength, ...path] = line.split(' ');
    return new Car(Number(pathLength), path);
  }
}

function calculateStreetPlan(streets, intersections) {
  const numOfIntersections = Object.keys(intersections).length;
  let result = '';
  result += numOfIntersections + '\n';
  for (const [key, value] of Object.entries(intersections)) {
    result += key + '\n';
    result += value.length + '\n';
    value.forEach((s) => {
      result += s.name + ' ' + 1 + '\n';
    });
  }
  return result;
}

const files = ['c', 'd', 'e', 'f'];

files.forEach((f) => {
  const lines = readLines(`input/googlehashcode/${f}.txt`);
  const { streets, intersections, cars } = parse(lines);

  const res = calculateStreetPlan(streets, intersections);
  write([res], `./output/googlehashcode/${f}_out`);
});
