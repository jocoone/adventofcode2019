const { readLines } = require('../utils/readandwrite');

class Moon {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xVel = 0;
        this.yVel = 0;
        this.zVel = 0;
    }

    applyGravity(moon) {
        if (this.x > moon.x) {
            moon.xVel += 1;
            this.xVel -= 1;
        }
        if (this.y > moon.y) {
            moon.yVel += 1;
            this.yVel -= 1;
        }
        if (this.z > moon.z) {
            moon.zVel += 1;
            this.zVel -= 1;
        }
    }

    move() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.z += this.zVel;
    }

    getPotentialEnergy() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }

    getKineticEnergy() {
        return Math.abs(this.xVel) + Math.abs(this.yVel) + Math.abs(this.zVel);
    }

    getEnergy() {
        return this.getPotentialEnergy() * this.getKineticEnergy();
    }
}

function part1(file, steps) {
    console.time('aoc12p1');
    const reg = /x=(-?\d*), y=(-?\d*), z=(-?\d*)/;
    const moons = readLines(file)
        .map(x => reg.exec(x))
        .map((x) => new Moon(Number(x[1]), Number(x[2]), Number(x[3])));
    for(let time = 0; time < steps; time++) {
        moveMoons(moons);
    }
    const result = moons.reduce((tot, moon) => tot + moon.getEnergy(), 0);
    console.timeEnd('aoc12p1');
    return result;
}

function moveMoons(moons) {
    moons.forEach(moon => {
        moons.forEach(m => {
            moon.applyGravity(m);
        });
    });
    moons.forEach(moon => moon.move());
}

function leastCommonMultiple(nums) {
    function greatestCommonDivider(a, b) {
        return b === 0 ? a : greatestCommonDivider(b, a % b);
    }
    function leastCommonMultiple(a, b) {
        return (a * b) / greatestCommonDivider(a, b);
    }
    return nums.reduce((total, currentValue) => leastCommonMultiple(currentValue, total));
}

function getLoop(moons, prop) {
    let time = 0;
    const initPos = moons.map(moon => moon[prop] + ';' + moon[prop + 'Vel']).join(',');
    while (true) {
        time++;
        moveMoons(moons);
        const lastPos = moons.map(moon => moon[prop] + ';' + moon[prop + 'Vel']).join(',');
        if (lastPos === initPos) {
            return time;
        }
    }
}

function part2(file) {
    console.time('aoc12p2');
    const reg = /x=(-?\d*), y=(-?\d*), z=(-?\d*)/;
    const moons = readLines(file).map(x => reg.exec(x))
        .map((x) => new Moon(Number(x[1]), Number(x[2]), Number(x[3])));
    const xLoop = getLoop(moons, 'x');
    console.timeLog('aoc12p2', 'xLoop');
    const yLoop = getLoop(moons, 'y');
    console.timeLog('aoc12p2', 'yLoop');
    const zLoop = getLoop(moons, 'z');
    console.timeLog('aoc12p2', 'zLoop');
    console.log(xLoop, yLoop, zLoop);
    const result = leastCommonMultiple([xLoop, yLoop, zLoop]);
    console.timeEnd('aoc12p2');
    return result;
}

module.exports = {
    part1, part2
};