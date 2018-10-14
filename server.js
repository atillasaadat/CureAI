/**
 * Atilla Saadat
 * CureAI - MHacks11
 */
'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
//const assignments = require('./data.json');

const uri = "mongodb+srv://test_user:c4cNxAy2cvMVd9RI@cureai-xicbd.gcp.mongodb.net/test?retryWrites=true";

// Constants
const PORT = 8080;

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

// Authenticate and Get User
app.get('/users/auth/:user/:pass', function (req, res) {
    var user = req.params.user;
    var pass = req.params.pass;

    MongoClient.connect(uri, function(err, client) {
        const collection = client.db("CureAI").collection("users");
        collection.findOne({ username: user, password: pass }).then((doc) => {

            if (doc) {
                res.status(200).json({
                    status: "success",
                    user: doc
                })
            } else {
                res.status(200).json({
                    status: "failed"
                })
            }

            client.close();
        });
    });
})

// Create User
app.get('/users/create/:user/:email/:pass/', function (req, res) {
    var user = req.params.user;
    var mail = req.params.email;
    var pass = req.params.pass;

    MongoClient.connect(uri, function(err, client) {
        const collection = client.db("CureAI").collection("users");
        const doc = {
            username: user,
            email: mail,
            password: pass,
            firstName: '',
            lastName: '',
            birthday: '',
            gender: '',
            occupation: '',
            relationshipStatus: '',
            chatLogs: []
        };

        collection.insertOne(doc).then((result) => {
            console.log(result);
            res.status(200).json({
                status: "success",
                user: doc
            })
            client.close();
        });
    });
})

// More Info
app.get('/users/moreInfo/:user/:first/:last/:birth/:sex/:job/:relation/', function (req, res) {
    var user = req.params.user;
    var first = req.params.first;
    var last = req.params.last;
    var birth = req.params.birth;
    var sex = req.params.sex;
    var job = req.params.job;
    var relation = req.params.relation;

    MongoClient.connect(uri, function(err, client) {
        const collection = client.db("CureAI").collection("users");
        const changes = {
            firstName: first,
            lastName: last,
            birthday: birth,
            gender: sex,
            occupation: job,
            relationshipStatus: relation
        };

        collection.findOneAndUpdate({ username: user }, { $set: changes }, {returnNewDocument: true}).then((doc) => {
            res.status(200).json({
                status: "success",
                user: doc
            })
            client.close();
        });
    });
})

// More Info
app.get('/users/addLogs/:user/:msg/:response', function (req, res) {
    var user = req.params.user;
    var msg = req.params.msg;
    var response = req.params.response;

    
})

// Get Therapist Response
app.get('/therapist/ask/:email/:msg', function (req, res) {
    var emailText = req.params.email;
    var msg = req.params.msg;
    var response;

    // Clinc Login Here (set response variable)
    // ============================

    response = "So how does that make you feel?";

    // ============================

    MongoClient.connect(uri, function(err, client) {
        const collection = client.db("CureAI").collection("users");
        const changes = {
            chatLogs: { 
                userMessage: msg,
                therapistResponse: response
            }
        };

        collection.findOneAndUpdate({ email: emailText }, { $push: changes }, {returnNewDocument: true}).then((doc) => {
            res.status(200).json({
                status: "success",
                user: doc
            })
            client.close();
        });
    });

    res.status(200).json({
        status: "success",
        msg: response
    })
});

app.listen(PORT, () => {
    console.log(`Running on port ` + PORT);
});

