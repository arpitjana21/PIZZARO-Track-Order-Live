const express = require('express');
const viewController = require('../app/http/controllers/viewController');
const orderController = require('../app/http/controllers/orderController');
const authController = require('../app/http/controllers/authController');
const middleware = require('../app/http/middlewares/middleware');
const viewRouter = express.Router();

viewRouter.use(authController.isloggedIn);

// viewRouter.route('/').get(orderController.placeOrder, viewController.homeView);
viewRouter.route('/').get(orderController.placeOrder, viewController.homeView);
viewRouter.route('/cart').get(viewController.cartView);
viewRouter.route('/login').get(viewController.loginView);
viewRouter.route('/register').get(viewController.registerView);

viewRouter
    .route('/account')
    .get(middleware.userView, viewController.accountView);

viewRouter
    .route('/customer/orders')
    .get(middleware.customerView, viewController.customerOrdersView);

viewRouter
    .route('/admin/orders')
    .get(middleware.adminView, viewController.adminOrdersView);

viewRouter.route('/update-cart').post(viewController.updateCart);
viewRouter.route('/plus-pizza').post(viewController.plusPizza);
viewRouter.route('/minus-pizza').post(viewController.minusPizza);
viewRouter.route('/subscribe').post(viewController.addSubscription);

module.exports = {viewRouter};
