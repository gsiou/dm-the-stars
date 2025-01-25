const tables = require('./sample_oracle');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function roll() {
    const die1 = getRandomInt(12);
    const die2 = getRandomInt(12);
    return {
        symbol: tables.symbol[die1],
        position: tables.position[die2]
    };
}

module.exports.roll = roll;