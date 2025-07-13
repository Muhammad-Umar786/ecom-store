require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

const itemsData = [
    { name: 'Apple', price: 1.5, image: '/uploads/apple.png' },
    { name: 'Banana', price: 1.0, image: '/uploads/banana.png' },
    { name: 'Blueberry', price: 2.0, image: '/uploads/blueberry.png' },
    { name: 'Grapes', price: 2.5, image: '/uploads/grapes.png' },
    { name: 'Mango', price: 3.0, image: '/uploads/mango.png' },
    { name: 'Melon', price: 3.5, image: '/uploads/melon.png' },
    { name: 'Orange', price: 1.8, image: '/uploads/orange.png' },
    { name: 'Pineapple', price: 4.0, image: '/uploads/pineapple.png' }
];

const contactsData = [
    { firstName: 'John', lastName: 'Doe', message: 'Hello, I have a question about your products.' },
    { firstName: 'Jane', lastName: 'Smith', message: 'Can you help me with my order?' }
];

const usersData = [
    { fullName: 'Admin', email: 'admin@admin.com', phoneNumber: '1234567890', password: 'admin123', role: 'admin' },
    { fullName: 'User', email: 'user@example.com', phoneNumber: '0987654321', password: 'user123', role: 'user' }
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

    // Encrypt passwords and seed users
    for (const user of usersData) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    await User.insertMany(usersData);

    // Seed contacts
    await Contact.insertMany(contactsData);

    console.log('Seeding complete.');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    mongoose.connection.close();
});
