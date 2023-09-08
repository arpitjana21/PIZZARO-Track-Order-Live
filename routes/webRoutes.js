const express = require('express');
const viewController = require('../app/http/controllers/viewController');

const webRouter = express.Router();

webRouter.route('/').get(viewController.homeController);
webRouter.route('/cart').get(viewController.cartController);
webRouter.route('/login').get(viewController.loginController);
webRouter.route('/register').get(viewController.registerController);
webRouter.route('/update-cart').post(viewController.updateCart);

module.exports = {webRouter};
