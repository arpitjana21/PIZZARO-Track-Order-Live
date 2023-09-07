const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const {webRouter} = require('./routes/webRoutes');

const app = express();
dotenv.config({path: './config.env'});

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

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
        cookie: {maxAge: 1000 * 60 * 60 * 24},
        store: MongoStore.create({...storeOptions}),
    })
);
app.use(flash());
app.use(express.static('public'));

app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.use('/', webRouter);

app.listen(PORT, function () {
    console.log('Connecting with database..');
});
