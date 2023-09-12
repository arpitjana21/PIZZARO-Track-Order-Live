const userView = function (req, res, next) {
    console.log('I am userview');
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

module.exports = {userView, customerView, adminView};
