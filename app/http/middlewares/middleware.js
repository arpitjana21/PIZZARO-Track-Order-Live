const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

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

function encode(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decode(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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
