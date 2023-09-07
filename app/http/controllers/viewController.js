const homeController = function (req, res) {
    res.render('home');
};

const cartController = function (req, res) {
    res.render('customer/cart');
};

const loginController = function (req, res) {
    res.render('auth/login');
};
const registerController = function (req, res) {
    res.render('auth/register');
};
module.exports = {
    homeController,
    registerController,
    loginController,
    cartController,
};
