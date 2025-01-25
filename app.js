const nacl = require("tweetnacl");
const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config()
const { roll } = require('./roll');

const port = 9510;

const PUBLIC_KEY = process.env.PUBLIC_KEY;

app.use(morgan('combined'));

app.all('/', express.raw({ type: '*/*' }), (req, res) => {
    const body = req.body.toString();
    console.log(body);

    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");
    if (!timestamp || !signature) {
        return res.sendStatus(400);
    }
    console.log(timestamp);
    console.log(signature);
    console.log(PUBLIC_KEY);
    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, "hex"),
        Buffer.from(PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
        return res.status(401).send("invalid request signature");
    }

    const bodyParsed = JSON.parse(body);

    if (bodyParsed.type === 1) {
        return res.json({
            type: 1
        })
    }

    const oracleResult = roll();

    const messageContent = `*You asked the ✨Stars✨\n*` +
    `The dice rolled <${oracleResult.die1+1}> <${oracleResult.die2+1}> \n` +
    `**Inspiration**\n` +
    `**Symbol**: ${oracleResult.symbol.symbolic} (${oracleResult.symbol.literal})\n` +
    `**Position**: ${oracleResult.position.symbolic} (${oracleResult.position.literal})\n\n` +
    `**Answer (Yes / No)**\n` +
    `Less likely: ||${oracleResult.lessLikely}||\n` +
    `Equal Chance: ||${oracleResult.equal}||\n` +
    `More likely: ||${oracleResult.moreLikely}||\n`

    return res.json({
        "type": 4,
        "data": {
            "tts": false,
            "content": messageContent,
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    });
});

app.listen(port, () => {
    console.log(`Ask the Stars Discord App listening on port ${port}`);
})

