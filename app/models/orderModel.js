const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order Must have a User'],
    },
    items: {
        type: Object,
        required: [true, 'Order Must have items'],
    },
    address: {
        type: String,
        required: [true, 'Order Must have Address'],
    },
    phone: {
        type: String,
        validate: {
            validator: function (val) {
                return /^\+91[1-9][0-9]{9}$/.test(val);
            },
            message: 'Please Enter valid phone number: e.g: +91<10 digit>',
        },
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3, 4],
        default: 0,
    },
    statusUpdatedAt: {
        type: [Date],
        default: Date.now(),
    },
    payment: {
        type: String,
        default: 'COD',
    },
    itemCount: Number,
    amount: Number,
    placedAt: {
        type: Date,
        default: Date.now(),
    },
});

// orderSchema.pre(/^find/, function (next) {
//     this.populate('user');
//     next();
// });

const Order = mongoose.model('Order', orderSchema);
module.exports = {Order};
