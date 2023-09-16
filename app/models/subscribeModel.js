const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is not there'],
        unique: true,
    },
});

const Subscription = mongoose.model('subscription', subscriptionSchema);

module.exports = {Subscription};
