const express = require('express');
const authController = require('../app/http/controllers/authController');

const authRouter = express.Router();

authRouter.route('/register').post(authController.register);
authRouter.route('/login').post(authController.login);
authRouter.route('/logout').get(authController.logout);
authRouter
    .route('/updateUser')
    .post(authController.isloggedIn, authController.updateUser);

authRouter
    .route('/updatePassword')
    .post(authController.isloggedIn, authController.updatePassword);

module.exports = {authRouter};
