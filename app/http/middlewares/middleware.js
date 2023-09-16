const base64 = require('base-64');
const utf8 = require('utf8');

const userView = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('404');
    }
};

const customerView = function (req, res, next) {
    if (req.user && !req.user.isAdmin) {
        next();
    } else {
        res.render('404');
    }
};

const adminView = function (req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.render('404');
    }
};

const userProtected = function (req, res, next) {
    if (req.user) next();
    else {
        return res.status(400).json({
            status: 'fail',
            message: 'User not Logged-IN',
        });
    }
};

const customerProtected = function (req, res, next) {
    if (!req.user.isAdmin) next();
    else {
        return res.status(400).json({
            status: 'fail',
            message: 'You Not Allowed for This Activity',
        });
    }
};

const adminProtected = function (req, res, next) {
    if (req.user.isAdmin) next();
    else {
        return res.status(400).json({
            status: 'fail',
            message: 'ADMIN not Logged-IN',
        });
    }
};

const encode = function (text) {
    let bytes = utf8.encode(text);
    let encoded = base64.encode(bytes);
    return encoded;
};

const decode = function (encoded) {
    const bytes = base64.decode(encoded);
    const text = utf8.decode(bytes);
    return text;
};

module.exports = {
    userView,
    customerView,
    adminView,
    adminProtected,
    userProtected,
    customerProtected,
    encode,
    decode,
};
