// models/User.js
const { Schema, model } = require('mongoose');

const AddressSchema = new Schema({
  title:   { type: String },
  address: { type: String }
});

const UserSchema = new Schema({
  fullName:    { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password:    { type: String, required: true },
  role:        {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  addresses:   { type: [AddressSchema], default: [] },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = model('User', UserSchema);
