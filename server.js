/**
 * Atilla Saadat
 * CureAI - MHacks11
 */
'use strict';

const express = require('express');
//const assignments = require('./data.json');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json());

app.post('/clinc', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const state = req.body.state;
    const slots = req.body.slots;

    if(Object.keys(slots).length){
        var pName = Object.keys(slots)[0]
        if(pName=='_BULLYING_'){
            req.body.slots[pName].values[0].value = 'Test123';
        }
        const token = slots[pName].values[0].tokens;
        req.body.slots[pName].values[0].resolved = 1;   
    }
    console.log(req.body)
    res.send(req.body);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
