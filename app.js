const nacl = require("tweetnacl");
const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config()

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

    return res.json({
        "type": 4,
        "data": {
            "tts": false,
            "content": "Congrats on sending your command!",
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    });
});

app.listen(port, () => {
    console.log(`Ask the Stars Discord App listening on port ${port}`);
})

