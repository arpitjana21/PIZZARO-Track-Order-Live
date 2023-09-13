const {Order} = require('../../models/orderModel');

const placeOrder = async function (req, res) {
    try {
        const {phone, address} = req.body;
        const {items, totalQty, totalPrice} = req.session.cart;

        const orderData = {
            phone: `${phone}`,
            address: address,
            user: req.user._id,
            items: items,
            itemCount: totalQty,
            amount: totalPrice,
            statusTimings: [Date.now()],
        };

        const newOrder = await Order.create(orderData);
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0,
        };

        res.status(200).json({
            status: 'success',
            message: 'Order Places Sussesfully',
            data: {
                data: newOrder,
            },
        });
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

module.exports = {placeOrder, cancleOrder};
