const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    aircraft: {type: Schema.Types.ObjectId, ref: 'Aircraft', required: [true, 'Aircraft ID is required']},
    buyer: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Buyer ID is required']},
    price: {type: Number, required: [true, 'Price is required'], min: [0.01, 'Price must be greater than 0']},
    accepted: {
        type: String,
        enum: {
            values: ['Pending', 'Accepted', 'Rejected'],
            message: 'Accepted must be an approved value'
        },
        default: 'Pending'
    }
});

module.exports = mongoose.model('Offer', offerSchema);