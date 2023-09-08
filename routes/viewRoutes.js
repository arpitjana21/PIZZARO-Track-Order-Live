const express = require('express');
const viewController = require('../app/http/controllers/viewController');

const viewRouter = express.Router();

viewRouter.route('/').get(viewController.homeController);
viewRouter.route('/cart').get(viewController.cartController);
viewRouter.route('/login').get(viewController.loginController);
viewRouter.route('/register').get(viewController.registerController);
viewRouter.route('/update-cart').post(viewController.updateCart);
viewRouter.route('/plus-pizza').post(viewController.plusPizza);
viewRouter.route('/minus-pizza').post(viewController.minusPizza);

module.exports = {viewRouter};
