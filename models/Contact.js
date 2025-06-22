// models/Contact.js
const { Schema, model } = require('mongoose');

const ContactSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date,   default: Date.now }
});

module.exports = model('Contact', ContactSchema);
