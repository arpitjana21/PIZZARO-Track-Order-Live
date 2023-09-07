const express = require('express');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PPORT || 8000;

app.use(express.static('public'));

app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/cart', function (req, res) {
    res.render('customer/cart');
});

app.get('/login', function (req, res) {
    res.render('auth/login');
});

app.get('/register', function (req, res) {
    res.render('auth/register');
});

app.listen(PORT, function () {
    console.log(`URl : http://127.0.0.1:${PORT}/`);
});
