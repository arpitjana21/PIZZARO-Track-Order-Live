const express = require('express');
const authController = require('../app/http/controllers/authController');

const authRouter = express.Router();

authRouter.route('/register').post(authController.register);

module.exports = {authRouter};
