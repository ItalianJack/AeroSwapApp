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

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/aircraft', aircraftRoutes);

app.listen(port, host, () => {
    console.log(`Server running at ${host} on port ${port}`);
})