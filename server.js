const express = require('express');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PPORT || 8000;
const {webRouter} = require('./routes/webRoutes');

app.use(express.static('public'));

app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.use('/', webRouter);

app.listen(PORT, function () {
    console.log(`URl : http://127.0.0.1:${PORT}/`);
});
