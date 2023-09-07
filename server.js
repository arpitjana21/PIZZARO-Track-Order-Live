const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const {webRouter} = require('./routes/webRoutes');

const app = express();
dotenv.config({path: './config.env'});

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

app.use(express.static('public'));

app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.use('/', webRouter);

app.listen(PORT, function () {
    console.log('Connecting with database..');
});

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
