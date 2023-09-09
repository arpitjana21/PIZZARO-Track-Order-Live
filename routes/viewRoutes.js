const express = require('express');
const viewController = require('../app/http/controllers/viewController');
const authController = require('../app/http/controllers/authController');

const viewRouter = express.Router();

viewRouter
    .route('/')
    .get(authController.isloggedIn, viewController.homeController);
viewRouter
    .route('/cart')
    .get(authController.isloggedIn, viewController.cartController);
viewRouter
    .route('/login')
    .get(authController.isloggedIn, viewController.loginController);
viewRouter
    .route('/register')
    .get(authController.isloggedIn, viewController.registerController);
viewRouter
    .route('/update-cart')
    .post(authController.isloggedIn, viewController.updateCart);
viewRouter
    .route('/plus-pizza')
    .post(authController.isloggedIn, viewController.plusPizza);
viewRouter
    .route('/minus-pizza')
    .post(authController.isloggedIn, viewController.minusPizza);

module.exports = {viewRouter};
