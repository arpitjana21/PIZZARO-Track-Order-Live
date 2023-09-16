const express = require('express');
const orderController = require('../app/http/controllers/orderController');
const authController = require('../app/http/controllers/authController');
const middleware = require('../app/http/middlewares/middleware');

const orderRouter = express.Router();

orderRouter.use(authController.isloggedIn);

orderRouter
    .route('/getCheckOut')
    .post(middleware.customerProtected, orderController.getCheckOutSeccion);

orderRouter
    .route('/:orderDetails')
    .post(middleware.userProtected, orderController.placeOrder);

orderRouter
    .route('/:id')
    .post(middleware.adminProtected, orderController.updateOrderStatus)
    .delete(middleware.userProtected, orderController.cancleOrder);

module.exports = {orderRouter};
