const mongoose = require('mongoose'); // Mongoose is used to create the data schema

const productSchema = mongoose.Schema( {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
});

module.exports = mongoose.model('Product', productSchema); // Exports the finished model
