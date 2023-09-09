const {Order} = require('../../models/orderModel');

const placeOrder = async function (req, res) {
    try {
        const {phone, address} = req.body;
        const {items, totalQty, totalPrice} = req.session.cart;

        const orderData = {
            phone: `+91${phone}`,
            address: address,
            user: req.user._id,
            items: items,
            itemCount: totalQty,
            amount: totalPrice,
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

module.exports = {placeOrder};
