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
    // console.log(timestamp);
    // console.log(signature);
    // console.log(PUBLIC_KEY);
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

    let messageContent;
    const theUser = bodyParsed.member.user.global_name;

    if (bodyParsed.data.name === 'askthestars') {
        messageContent = `*${theUser} asked the ✨Stars✨*\n` +
        `The dice rolled <${oracleResult.die1+1}> <${oracleResult.die2+1}> \n` +
        `**Inspiration**\n` +
        `**Symbol**: ${oracleResult.symbol.symbolic} (${oracleResult.symbol.literal})\n` +
        `**Position**: ${oracleResult.position.symbolic} (${oracleResult.position.literal})\n\n` +
        `**Answer (Yes / No)**\n` +
        `Less likely: ||${oracleResult.lessLikely}||\n` +
        `Equal Chance: ||${oracleResult.equal}||\n` +
        `More likely: ||${oracleResult.moreLikely}||\n`
    } else if (bodyParsed.data.name === 'question') {
        const theQuestion = bodyParsed.data.options.find(opt => opt.name === 'question').value;
        const lessLikely = bodyParsed.data.options.find(opt => opt.name === 'yes_is_less_likely')?.value || false;
        const moreLikely = bodyParsed.data.options.find(opt => opt.name === 'yes_is_more_likely')?.value || false;
        let finalAnswer;
        if (lessLikely && !moreLikely) {
            finalAnswer = oracleResult.lessLikely;
        } else if (moreLikely && !lessLikely) {
            finalAnswer = oracleResult.moreLikely;
        } else {
            finalAnswer = oracleResult.equal;
        }
        messageContent = `${theUser} asked the ✨Stars✨: ${theQuestion}\n`+
            `<${oracleResult.die1+1}> <${oracleResult.die2+1}> \n` +
            `The Stars answered: **${finalAnswer}**`;
    } else if (bodyParsed.data.name === 'inspiration') {
        messageContent = `${theUser} asked the ✨Stars✨for inspiration\n`+
        `<${oracleResult.die1+1}> <${oracleResult.die2+1}> \n` +
        `The Stars have answered.\n` +
        `**Symbol**: ${oracleResult.symbol.symbolic} (${oracleResult.symbol.literal})\n` +
        `**Position**: ${oracleResult.position.symbolic} (${oracleResult.position.literal})\n`;
    } else {
        messageContent = 'The stars are not familiar with this command.'
    }


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
    console.log(`DM the Stars listening on port ${port}`);
})

