const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');

// Routers
const {webRouter} = require('./routes/webRoutes');

const app = express();
dotenv.config({path: './config.env'});

// ENV Variables
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

// Session Store
const storeOptions = {
    mongoUrl: DATABASE,
    collection: 'sessions',
};

// Session Config
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}, // 7 Day Session
        store: MongoStore.create({...storeOptions}),
    })
);
app.use(flash());

// Global Middleware
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// Setting View
app.use(express.static('public'));
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Recieve JSON from req
app.use(express.json());

// Routes
app.use('/', webRouter);

app.listen(PORT, function () {
    console.log('Connecting with database..');
});

// Connect to Database
mongoose
    .connect(DATABASE)
    .then(function () {
        console.log('Database Connection Successful.');
        console.log(`URl : http://127.0.0.1:${PORT}/`);
    })
    .catch(function (err) {
        console.log('\n⚠ DATABASE CONNECTION ERROR ⚠\n');
        console.log(err);
    });
