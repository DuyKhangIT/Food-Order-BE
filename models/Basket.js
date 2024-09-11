const mongoose = require('mongoose');

const BasketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Basket', BasketSchema);
