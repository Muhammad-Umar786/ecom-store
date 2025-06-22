// models/Item.js
const { Schema, model } = require('mongoose');

const ItemSchema = new Schema({
  image: { type: String, required: true },
  name:  { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = model('Item', ItemSchema);
