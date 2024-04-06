// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const aircraftRoutes = require('./routes/aircraftRoutes');

// create app
const app = express();

// configure app
let host = 'localhost';
let port = 3000;
app.set('view engine', 'ejs');

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Default route
app.get('/', (req, res) => {
    res.render('index');
});

// /aircraft route
app.use('/aircraft', aircraftRoutes);

// If the server gets here that means the request wasn't handled otherwise, so the page must not exist; throw 404
app.use((req, res, next) => {
    let err = new Error(`The server cannot locate ${req.url}`);
    err.status = 404;
    next(err);
});

// Error page/handling
app.use((err, req, res, next) => {
    console.log('\n\n\n===== ERROR HANDLER =====');
    console.log(err);

    if (err.message.toLowerCase().includes('validation')) {
        err.status = 400;
        // err.message is fine as is
    } else if (err.reason && err.reason.toString().includes('BSONError')) {
        err.status = 400;
        err.message = 'Bad Request: Invalid ID';
    } else if (!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }

    res.status(err.status);
    res.render('error', {err});
})

function printKeyValuePairs(err) {
    console.log('KEY/VALUE PAIRS: ');
    Object.keys(err).forEach(key => {
        console.log(key + ': ' + err[key]);
    });
}

mongoose.connect('mongodb+srv://dbUser:dbUserPassword@project3.jnmet5s.mongodb.net/aeroswap')
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at ${host} on port ${port}`);
        })
    })
    .catch(err => {
        console.log(`Error connecting to DB: ${err}`);
    });