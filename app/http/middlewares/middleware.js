const crypto = require('crypto');

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

// function encrypt(text) {
//     const cipher = crypto.createCipher(algorithm, secretKey);
//     let encrypted = cipher.update(text, 'utf-8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
// }

// function decrypt(encryptedText) {
//     const decipher = crypto.createDecipher(algorithm, secretKey);
//     let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
//     decrypted += decipher.final('utf-8');
//     return decrypted;
// }

module.exports = {
    userView,
    customerView,
    adminView,
    adminProtected,
    userProtected,
    customerProtected,
};
