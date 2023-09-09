const express = require('express');
const orderController = require('../app/http/controllers/orderController');
const authController = require('../app/http/controllers/authController');

const orderRouter = express.Router();

orderRouter
    .route('/')
    .post(authController.isloggedIn, orderController.placeOrder);

module.exports = {orderRouter};
