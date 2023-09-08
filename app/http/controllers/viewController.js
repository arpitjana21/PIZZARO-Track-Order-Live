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

const updateSessionCart = function (req, pizza, type) {
    if (!req.session.cart) {
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0,
        };
    }

    const cart = req.session.cart;

    // Check if items does not exist in cart
    if (!cart.items[pizza.slug]) {
        cart.items[pizza.slug] = {
            data: pizza,
            qty: 1,
        };
        cart.totalQty++;
        cart.totalPrice += pizza.price[pizza.size];
    } else {
        if (type === 1) {
            cart.items[pizza.slug].qty++;
            cart.totalQty++;
            cart.totalPrice += pizza.price[pizza.size];
        }
        if (type === -1) {
            cart.items[pizza.slug].qty--;
            if (cart.items[pizza.slug].qty === 0) {
                delete cart.items[pizza.slug];
            }
            cart.totalQty--;
            cart.totalPrice -= pizza.price[pizza.size];
        }
    }
};

const updateCart = function (req, res) {
    const pizza = req.body;
    updateSessionCart(req, pizza, 1);

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
