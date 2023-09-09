const {Menu} = require('../../models/menuModel');

const homeController = async function (req, res) {
    const pizzas = await Menu.find();
    res.render('home', {pizzas: pizzas});
};

const cartController = function (req, res) {
    res.render('customer/cart');
};

const loginController = function (req, res) {
    if (!res.user) return res.render('auth/login');
    return res.redirect('/');
};

const registerController = function (req, res) {
    if (!res.user) return res.render('auth/register');
    return res.redirect('/');
};

const accountController = function (req, res, next) {
    if (req.user) {
        return res.render('customer/account');
    }
    next();
};

const ordersController = function (req, res, next) {
    if (req.user) {
        return res.render('customer/orders');
    }
    next();
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

const plusPizza = function (req, res) {
    const pizza = req.body;
    updateSessionCart(req, pizza, 1);
    return res.json({
        status: 'success',
        pizzaQty: req.session.cart.items[pizza.slug].qty,
        totalQty: req.session.cart.totalQty,
        totalPrice: req.session.cart.totalPrice,
    });
};

const minusPizza = function (req, res) {
    const pizza = req.body;
    updateSessionCart(req, pizza, -1);
    const pizzaQty = req.session.cart.items[pizza.slug]
        ? req.session.cart.items[pizza.slug].qty
        : 0;
    return res.json({
        status: 'success',
        pizzaQty: pizzaQty,
        totalQty: req.session.cart.totalQty,
        totalPrice: req.session.cart.totalPrice,
    });
};

module.exports = {
    homeController,
    registerController,
    loginController,
    cartController,
    ordersController,
    accountController,
    updateCart,
    plusPizza,
    minusPizza,
};
