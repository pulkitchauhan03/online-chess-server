const mongoose = require('mongoose');

const Match = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: string,
        enum: ['waiting', 'playing', 'finished'],
        default: 'waiting',
        required: true
    },
    challenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('Match', Match);