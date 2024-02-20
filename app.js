// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
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

// Error page
app.use((err, req, res, next) => {
    console.log(err.stack);

    if (!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }

    res.status(err.status);
    res.render('error', {err});
})

app.listen(port, host, () => {
    console.log(`Server running at ${host} on port ${port}`);
})