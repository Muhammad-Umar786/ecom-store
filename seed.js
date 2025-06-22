// seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Order = require('./models/Order');
const Contact = require('./models/Contact');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecom';

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear collections
    await User.deleteMany({});
    await Item.deleteMany({});
    await Order.deleteMany({});
    await Contact.deleteMany({});

    // Seed Users
    const users = await User.insertMany([
        {
            fullName: 'Admin User',
            email: 'admin@dealbaaz.com',
            phoneNumber: '03001234567',
            password: 'adminpass',
            role: 'admin',
            addresses: [
                { title: 'Home', address: 'F-10 Islamabad' }
            ]
        },
        {
            fullName: 'Test User',
            email: 'user@dealbaaz.com',
            phoneNumber: '03111234567',
            password: 'userpass',
            role: 'user',
            addresses: [
                { title: 'Office', address: 'G-11 Islamabad' }
            ]
        }
    ]);

    // Seed Items (make sure these images exist in /uploads/)
    const items = await Item.insertMany([
        {
            image: '/uploads/banana.jpeg',
            name: 'Banana',
            price: 39.99
        },
        {
            image: '/uploads/grapes.jpg',
            name: 'Grapes',
            price: 49.99
        },
        {
            image: '/uploads/tree.jpg',
            name: 'Tree Fruit',
            price: 59.99
        },
        {
            image: '/uploads/energy-food.png',
            name: 'Energy Food',
            price: 29.99
        },
        {
            image: '/uploads/bean.jpg',
            name: 'Beans',
            price: 19.99
        },
        {
            image: '/uploads/coffee.webp',
            name: 'Coffee',
            price: 99.99
        },
        {
            image: '/uploads/gf1.jpg',
            name: 'Green Fruit',
            price: 44.99
        },
        {
            image: '/uploads/Men_hold_fruit.jpg',
            name: 'Fruit Basket',
            price: 79.99
        }
    ]);

    // Seed Contact
    await Contact.create({
        firstName: 'Ali',
        lastName: 'Customer',
        message: 'Hello, I love your store!'
    });

    // Seed Order
    await Order.create({
        user: users[1]._id,
        paymentInfo: {
            cardNumber: '1234567890123456',
            expiry: '12/30',
            cvv: '123'
        },
        items: [
            { name: items[0].name, quantity: 2, price: items[0].price },
            { name: items[1].name, quantity: 1, price: items[1].price }
        ],
        totalPrice: items[0].price * 2 + items[1].price,
        status: 'pending'
    });

    console.log('Database seeded!');
    await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
