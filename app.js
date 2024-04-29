// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const aircraftRoutes = require('./routes/aircraftRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');

let MONGODB_URI;
// if (process.env.NODE_ENV === 'test') {
//     MONGODB_URI = 'mongodb+srv://dbUser:dbUserPassword@project3.jnmet5s.mongodb.net/aeroswap-test';
// } else {
    MONGODB_URI = 'mongodb+srv://dbUser:dbUserPassword@project3.jnmet5s.mongodb.net/aeroswap';
// }


// create app
const app = express();

// configure app
let host = 'localhost';
let port = 3000;
app.set('view engine', 'ejs');

// mount middleware
// Order: session, flash, res.locals, static, urlencoded, morgan, methodOverride
app.use(
    session({
        secret: 'asdlkfjasdklfjlakdsfl123', // Used for encryption
        resave: false, // Save session even if it wasn't modified
        saveUninitialized: false, // Don't save new sessions that haven't been modified (no empty sessions)
        store: new MongoStore({ mongoUrl: MONGODB_URI }),
        cookie: {
            maxAge: 1000 * 60 * 60 // 1 hour
        }
    })
);
app.use(flash());
// Assign res.locals properties so they are passed to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});
app.use(express.static('public')); // Make content in public folder accessible with static routes
app.use(express.urlencoded({extended: true})); // Used for parsing form data (images)
app.use(morgan('tiny')); // Log requests to the console
app.use(methodOverride('_method')); // Allow PUT and DELETE methods to be used in forms

// Connect to database & start app
mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at ${host} on port ${port}`);
        })
    })
    .catch(err => {
        console.log(`Error connecting to DB: ${err}`);
    });

// ROUTES

// Default route
app.get('/', (req, res) => {
    return res.render('index');
});

// /aircraft and /users routes
app.use('/aircraft', aircraftRoutes);
app.use('/users', userRoutes);

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
    // printKeyValuePairs(err);

    if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('back');
    }
    if (err.code === 11000) {
        req.flash('error', 'Email already in use!');
        return res.redirect('back');
    } else if (err.reason && err.reason.toString().includes('BSONError')) {
        err.status = 400;
        err.message = 'Bad Request: Invalid ID';
    } else if (!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }

    res.status(err.status);
    return res.render('error', {err});
})

// Export the app for use with Chai and Mocha
module.exports = app;

// For debugging
function printKeyValuePairs(err) {
    console.log('KEY/VALUE PAIRS: ');
    Object.keys(err).forEach(key => {
        console.log('  ' + key + ': ' + err[key]);
        console.log(Object.keys(err[key]))
    });
}
