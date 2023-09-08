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

const updateCart = function (req, res) {
    if (!req.session.cart) {
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0,
        };
    }

    const cart = req.session.cart;
    const pizza = req.body;

    // Check if items does not exist in cart
    if (!cart.items[pizza._id]) {
        cart.items[pizza._id] = {
            pizza: pizza,
            qty: 1,
        };
        cart.totalQty++;
        cart.totalPrice += pizza.price;
    } else {
        cart.items[pizza._id].qty++;
        cart.totalQty++;
        cart.totalPrice += pizza.price;
    }

    return res.json({
        totalQty: req.session.cart.totalQty,
    });
};

module.exports = {
    homeController,
    registerController,
    loginController,
    cartController,
    updateCart,
};
