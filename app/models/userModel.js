const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE !!
            validator: function (pass) {
                return pass === this.password;
            },
            message: 'Passwords are not Same',
        },
    },
});

userSchema.pre('save', async function (next) {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delet passwordConfirmed field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (plainPass, hashPass) {
    const res = await bcrypt.compare(plainPass, hashPass);
    return res;
};

const User = mongoose.model('User', userSchema);
module.exports = {User};
