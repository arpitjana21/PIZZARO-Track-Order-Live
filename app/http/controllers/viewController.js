const {Menu} = require('../../models/menuModel');
const homeController = async function (req, res) {
    const pizzas = await Menu.find();
    res.render('home', {pizzas: pizzas});
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
