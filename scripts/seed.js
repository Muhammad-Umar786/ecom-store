require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

const itemsData = [
    { name: 'Banana', price: 1.0, image: '/uploads/banana.jpeg' },
    { name: 'Bean', price: 2.0, image: '/uploads/bean.jpg' },
    { name: 'Coffee', price: 3.5, image: '/uploads/coffee.webp' },
    { name: 'Energy Food', price: 4.0, image: '/uploads/energy-food.png' },
    { name: 'Grapes', price: 2.5, image: '/uploads/grapes.jpg' },
    { name: 'Men Holding Fruit', price: 5.0, image: '/uploads/Men_hold_fruit.jpg' },
    { name: 'Tree', price: 6.0, image: '/uploads/tree.jpg' },
    { name: 'GF1', price: 7.0, image: '/uploads/gf1.jpg' }
];

const contactsData = [
    { firstName: 'John', lastName: 'Doe', message: 'Hello, I have a question about your products.' },
    { firstName: 'Jane', lastName: 'Smith', message: 'Can you help me with my order?' }
];

async function seed() {
    await connectDB();

    // Clear existing data
    await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        Order.deleteMany({}),
        Contact.deleteMany({})
    ]);

    // Seed items
    await Item.insertMany(itemsData);

    // Seed users
    await User.create([
        { fullName: 'Admin', email: 'admin@admin.com', phoneNumber: '1234567890', password: 'admin123', role: 'admin' },
        { fullName: 'User', email: 'user@example.com', phoneNumber: '0987654321', password: 'user123', role: 'user' }
    ]);

    // Seed contacts
    await Contact.insertMany(contactsData);

    console.log('Seeding complete.');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    mongoose.connection.close();
});
