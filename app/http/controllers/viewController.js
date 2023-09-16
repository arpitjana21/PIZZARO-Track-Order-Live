const {Menu} = require('../../models/menuModel');
const {Order} = require('../../models/orderModel');
const {Subscription} = require('../../models/subscribeModel');

const homeView = async function (req, res) {
    const pizzas = await Menu.find();
    res.render('home', {pizzas: pizzas});
};

const cartView = function (req, res) {
    res.render('customer/cart');
};

const loginView = function (req, res, next) {
    if (!res.user) return res.render('auth/login');
    next();
};

const registerView = function (req, res, next) {
    if (!res.user) return res.render('auth/register');
    next();
};

const accountView = function (req, res) {
    return res.render('customer/account');
};

const customerOrdersView = async function (req, res) {
    const userId = req.user._id;
    const orders = await Order.find({user: userId}).sort('-createdAt');
    return res.render('customer/orders', {orders: orders});
};

const adminOrdersView = async function (req, res) {
    const orders = await Order.find().sort('-createdAt');
    // const orders = await Order.find().sort('-updatedAt');
    return res.render('admin/orders', {orders: orders});
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

const addSubscription = async function (req, res) {
    try {
        const {email} = req.body;
        const subs = await Subscription.findOne({email});
        if (subs)
            return res.status(200).json({
                message: '⛔ Email Already had Subscription',
            });
        const newSubs = await Subscription.create({email: req.body.email});
        return res.status(200).json({
            message: '✅ Subscription Added Successfully',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};

module.exports = {
    homeView,
    registerView,
    loginView,
    cartView,
    customerOrdersView,
    adminOrdersView,
    accountView,
    updateCart,
    plusPizza,
    minusPizza,
    addSubscription,
};
