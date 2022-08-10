// Packages

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const fs = require("fs");
const http = require("http");

// Create app

const app = express();

// Firebase related

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const signups = db.collection('signups');

const path = __dirname + '/';

app.use(express.static(path));
app.use(express.static(path + '/Assets/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async function (req, res) {
    await signups.get().then(function (snapshot) {
        console.log(snapshot.size);
    });
    res.sendFile(path + 'index.html');
});

app.post('/', async function (req, res) {
    email = req.body.email;
    mobile = '+91' + req.body.mobile;
    if (email == '' && mobile == '+91' && mobile.length != 12) {
        res.sendFile(path + 'failure.html');
    }
    const check = await signups.where('mobile', '==', mobile).get();

    if (check.empty) {
        await signups.add({
            mobile: mobile,
            email: email,
            date: Date(),
        }).then(function () {
            res.sendFile(path + 'success.html');
        });
    } else {
        res.sendFile(path + 'failure.html');
    }
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


// httpsServer.listen(httpsPort, hostname);
app.listen(8080, function () {});
