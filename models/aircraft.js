const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aircraftSchema = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    condition: {
        type: String,
        enum: {
            values: ['New', 'Like new', 'Used, no engine overhauls', 'Used, one engine overhaul', 'Used, two or more overhauls'],
            message: 'Condition must be an approved value'
        },
        required: true
    },
    price: {type: Number, required: [true, 'Price is required'], min: [0.01, 'Price must be greater than 0']},
    details: {type: String, required: [true, 'Details are required']},
    image: {type: String, required: [true, 'Image is required']},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Aircraft', aircraftSchema);