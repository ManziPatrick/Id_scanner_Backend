// models/data.js

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    type: String,
    data: String, 
    inputCount: {
        type: Number,
        default: 1
    
    },
    transactions: {
        type: [{
            message: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    }
});

module.exports = mongoose.model('Data', dataSchema);
