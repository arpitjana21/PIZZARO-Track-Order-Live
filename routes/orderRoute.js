const express = require('express');
const orderController = require('../app/http/controllers/orderController');
const authController = require('../app/http/controllers/authController');

const orderRouter = express.Router();
orderRouter.use(authController.isloggedIn);
orderRouter.route('/').post(orderController.placeOrder);
orderRouter.route('/:id').delete(orderController.cancleOrder);

module.exports = {orderRouter};
