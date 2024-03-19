const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aircraftSchema = new Schema({
    title: {type: String, required: true},
    seller: {type: String, required: true},
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Used, no engine overhauls', 'Used, one engine overhaul', 'Used, two or more overhauls']
    },
    price: {type: Number, required: true},
    details: {type: String, required: true},
    image: {type: String, required: true},
    totalOffers: {type: Number, default: 0},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Aircraft', aircraftSchema);