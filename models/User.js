const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    matches: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Match',
        default: []
    }
});

module.exports = mongoose.model('User', User);
