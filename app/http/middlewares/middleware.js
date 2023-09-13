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

const adminProtected = function (req, res, next) {
    if (req.user.isAdmin) next();
    else {
        return res.status(400).json({
            status: 'fail',
            message: 'ADMIN not Logged-IN',
        });
    }
};

module.exports = {
    userView,
    customerView,
    adminView,
    adminProtected,
    userProtected,
};
