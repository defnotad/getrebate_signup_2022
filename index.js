// // Packages

// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');
// const fs = require("fs");
// const https = require("https");
// const http = require("http");


// // SSL

// const cert = fs.readFileSync(__dirname + '/SSL/getrebate_in.crt');
// const ca = fs.readFileSync(__dirname + '/SSL/getrebate_in.ca-bundle');
// const key = fs.readFileSync(__dirname + '/SSL/getrebate_in.key');

// // Create app

// const hostname = 'www.getrebate.in';
// // const httpsPort = 443;

// const app = express();

// // Creating the https server

// const options = {
//     cert: cert,
//     ca: ca,
//     key: key
// };

// // const httpsServer = https.createServer(options, app);
// const httpServer = http.createServer(app);


// // Firebase related

// const serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();
// const signups = db.collection('signups');

// const path = __dirname + '/Public/';

// app.use(express.static(path));
// app.use(express.static(path + 'Assets/'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', async function (req, res) {
//     await signups.get().then(function (snapshot) {
//         console.log(snapshot.size);
//     });
//     res.sendFile(path + 'index.html');
// });

// app.post('/', async function (req, res) {
//     console.log("started");
//     email = req.body.email;
//     mobile = '+91' + req.body.mobile;
//     if (email == '' && mobile == '+91' && mobile.length != 12) {
//         alert("Check details");
//     }
//     const check = await signups.where('mobile', '==', mobile).get();

//     if (check.empty) {
//         await signups.add({
//             mobile: mobile,
//             email: email,
//             date: Date(),
//         }).then(function () {
//             alert("Done boys");
//         });
//     } else {
//         alert("Something went wrong");
//     }
// });

// app.post("/failure", function (req, res) {
//     res.redirect("/");
// });


// // httpsServer.listen(httpsPort, hostname);
// app.listen(8080, function () { });

// Packages

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const fs = require("fs");
// const https = require("https");
// const http = require("http");

// SSL

// const cert = fs.readFileSync(__dirname + '/SSL/getrebate_in.crt');
// const ca = fs.readFileSync(__dirname + '/SSL/getrebate_in.ca-bundle');
// const key = fs.readFileSync(__dirname + '/SSL/getrebate_in.key');

// Create app

// const hostname = 'www.getrebate.in';
// const httpsPort = 443;
// const port = process.env.PORT || 3000;

const app = express();

// Creating the https server

// const options = {
//     cert: cert,
//     ca: ca,
//     key: key
// };

// const httpsServer = https.createServer(options, app);

// Redirect http requests

// app.use((req, res, next) => {
//     if(req.protocol === 'http') {
//       res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
//  });

// Firebase related

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const signups = db.collection('signups');

// Begin

const path = __dirname + '/Public/';

app.use(express.static(path));
app.use(express.static(path + 'assets/images/'));
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
        res.sendFile(__dirname + 'failure.html');
    }
    const check = await signups.where('mobile', '==', mobile).get();

    if (check.empty) {
        await signups.add({
            mobile: mobile,
            email: email,
            date: Date(),
        }).then(function () {
            res.sendFile(__dirname + 'success.html');
        });
    } else {
        res.sendFile(__dirname + 'failure.html');
    }
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


// httpsServer.listen(httpsPort, hostname);

app.listen(8081, () => console.log(`Server Running on 8081`));

// app.listen(8080, function () {});