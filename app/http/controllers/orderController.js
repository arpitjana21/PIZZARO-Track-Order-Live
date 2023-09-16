const {Order} = require('../../models/orderModel');
const stripe = require('stripe');
const middleware = require('../middlewares/middleware');

const getLineItems = function (req) {
    const lineItems = [];
    Object.values(req.session.cart.items).forEach(function (item) {
        lineItems.push({
            price_data: {
                product_data: {
                    name: item.data.name,
                    description: item.veg ? 'veg' : 'non-veg',
                    images: [item.data.image],
                },
                currency: 'inr',
                unit_amount: item.data.price[item.data.size] * 100,
            },
            quantity: item.qty,
        });
    });

    return lineItems;
};

const getCheckOutSeccion = async function (req, res) {
    try {
        const {phone, address} = req.body;
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        const URL = `${req.protocol}://${req.get('host')}`;

        const encode = middleware.encode(JSON.stringify({phone, address}));
        // const successURL = `${URL}?phone=${phone}&address=${address}`;
        const successURL = `${URL}?odata=${encode}`;

        const cancelURL = `${URL}/cart`;

        const session = await stripe(stripeKey).checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: successURL,
            cancel_url: cancelURL,
            line_items: getLineItems(req),
            mode: 'payment',
        });

        // Create session as response
        res.status(200).json({
            status: 'success',
            session: session,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};

const placeOrder = async function (req, res, next) {
    const {odata} = req.query;
    const decode = JSON.parse(middleware.decode(odata));
    const {phone, address} = decode;
    console.log(phone, address);
    if (!phone && !address) {
        return next();
    }

    try {
        const {items, totalQty, totalPrice} = req.session.cart;

        const orderData = {
            phone: phone,
            address: address,
            user: req.user._id,
            items: items,
            itemCount: totalQty,
            amount: totalPrice,
            statusTimings: [Date.now()],
        };

        const newOrder = await Order.create(orderData);

        // Reset The Session
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0,
        };

        const eventEmmiter = req.app.get('eventEmmiter');
        eventEmmiter.emit('orderPlaced', newOrder);
        return next();
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};

const cancleOrder = async function (req, res) {
    try {
        const userID = req.user._id;
        const orderID = req.params.id;

        const order = await Order.findById(orderID);

        // Check if User is not the same
        if (order.user._id.toString() !== userID.toString()) {
            // Check if user is not Admin
            if (req.user.isAdmin === false) {
                throw new Error('User Not Identified');
            }
        }

        await Order.findByIdAndDelete(orderID);
        return res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};

const updateOrderStatus = async function (req, res) {
    try {
        const orderID = req.params.id;
        const status = Number(req.body.status);
        const order = await Order.findById(orderID);

        const statusStr = [
            'Received',
            'Confirmed',
            'Prepared',
            'Delivery',
            'Completed',
        ];

        if (order.status === 4) {
            throw new Error(`Status is Already Completed !`);
        }

        if (status > order.status && status !== order.status + 1) {
            throw new Error(
                `Next Status Should be #${statusStr[order.status + 1]}`
            );
        }

        order.status = status;
        order.statusTimings.length = status + 1;
        order.statusTimings[status] = Date.now();

        const updatedOrder = await order.save();

        // Emmite Event
        const eventEmmiter = req.app.get('eventEmmiter');
        eventEmmiter.emit('orderUpdated', updatedOrder);

        res.status(200).json({
            status: 'sussess',
            order: updatedOrder,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};

module.exports = {
    placeOrder,
    cancleOrder,
    updateOrderStatus,
    getCheckOutSeccion,
};
