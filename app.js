// app.js
const express = require('express');
const session = require('express-session');
const path    = require('path');
const connectDB = require('./config/db');
const expressLayouts     = require('express-ejs-layouts');
require('dotenv').config();


connectDB();

const app = express();
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.set('layout', 'layout');

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'image')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// API routes (JSON only)
app.use('/contacts', require('./routes/contact'));
app.use('/items',    require('./routes/items'));
app.use('/users',    require('./routes/users'));
app.use('/orders',   require('./routes/orders'));

// Views will come later under /views
app.use('/views', require('./routes/views'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API server listening on port ${PORT}`));
