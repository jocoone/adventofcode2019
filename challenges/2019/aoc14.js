const { readLines } = require('../utils/readandwrite');
const { findKey, findIndex } = require('lodash');

class Reaction {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
}

class Unit {
    constructor(amount, chemical) {
        this.amount = amount;
        this.chemical = chemical;
    }
}

function getInstructions(file) {
    return readLines(file)
        .map(line => {
            const s = line.split(' => ');
            const units = s[0].split(', ').map(u => {
                const [amount, chemical] = u.split(' ');
                return new Unit(Number(amount), chemical);
            })
            const [amount, chemical] = s[1].split(' ');
            const output = new Unit(Number(amount), chemical);
            return new Reaction(units, output);
        });
}

function countOtherChemicals(chemicals) {
    let count = 0;
    Object.keys(chemicals).filter(o => o !== 'ORE').forEach(c => {
        if (chemicals[c] > 0) {
            count += chemicals[c];
        }
    });
    return count;
}

function calculateOre(reverseReactions, key, toMake){ 
    if(key=='ORE') return toMake;
    let reaction = reverseReactions[key];//created on line 23

    //removed excess from how much we need to make
    if(reaction.stored > toMake){
        reaction.stored -= toMake;
        return 0;
    }
    toMake -= reaction.stored;
    let left = reaction.amount - (toMake % reaction.amount); //left will be how much extra this reaction will produce
    if(left==reaction.amount) left = 0;
    reaction.stored = left; 


    let times = Math.ceil(toMake/reaction.amount); // calculate how much total ingrediants are needed

    let subTotal = 0;
    reaction.input.forEach(chemical => {
        subTotal+=calculateOre(reverseReactions, chemical.chemical, chemical.amount * times);
    })
    return subTotal;
}

function getReverseReactions(instructions) {
    let reverseReactions = {};
    instructions.forEach(({input, output: { chemical, amount }}) => {
        reverseReactions[chemical] = {
            input,
            amount,
            stored: 0
        };
    });
    return reverseReactions;
}

function part1(file) {
    console.time('aoc14p1');
    
    const reverseReactions = getReverseReactions(getInstructions(file));
    
    console.timeEnd('aoc14p1');
    return calculateOre(reverseReactions, 'FUEL', 1);
}

function part2(file) {
    console.time('aoc14p2');
    const reverseReactions = getReverseReactions(getInstructions(file));

    let low = 0;
    let high = 1<<24;
    while (true) {
        if (high <= low || Math.abs(high - low) === 1) break;
        const mid = Math.floor((high + low) / 2);
        const ore = calculateOre(reverseReactions, 'FUEL', mid);
        if (1000000000000 < ore) {
            high = mid
        } else {
            low = mid;
        }
    }
    console.timeEnd('aoc14p2');
    return low - (high > low ? 0 : -1);
}

console.log(`Needs of ${part1('input/aoc14.txt')} ORE to produce 1 fuel!`)
console.log(`Needs of ${part2('input/aoc14test.txt')} FUEL produced with 1000000000000 ORE!`)

module.exports = {
    part1, part2
};