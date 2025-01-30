const tables = require('./ask_the_stars_oracle');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getAnswer(die) {
    switch (die) {
        case 0:
        case 1:
        case 2:
            return 'Hard No';
        case 3:
        case 4:
        case 5:
            return 'No';
        case 6:
        case 7:
        case 8:
            return 'Yes';
        case 9:
        case 10:
        case 11:
            return 'Hard Yes';
    } 
} 

function roll() {
    const die1 = getRandomInt(12);
    const die2 = getRandomInt(12);
    return {
        symbol: tables.symbol[die1],
        position: tables.position[die2],
        equal: getAnswer(die1),
        moreLikely: getAnswer(Math.max(die1, die2)),
        lessLikely: getAnswer(Math.min(die1, die2)),
        die1, die2
    };
}

module.exports.roll = roll;