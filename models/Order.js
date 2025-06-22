// models/Order.js
const { Schema, model } = require('mongoose');

const OrderItemSchema = new Schema({
  name:     { type: String, required: true },
  quantity: { type: Number, required: true },
  price:    { type: Number, required: true }
});

const OrderSchema = new Schema({
  user:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paymentInfo: {
    cardNumber: { type: String, required: true },
    expiry:     { type: String, required: true }, // format MM/YY
    cvv:        { type: String, required: true }
  },
  items:      { type: [OrderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  status:     {
    type: String,
    enum: ['delivered', 'on way', 'pending', 'canceled'],
    default: 'pending'
  },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = model('Order', OrderSchema);
