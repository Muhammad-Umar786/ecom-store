// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const expressLayouts = require('express-ejs-layouts');
const requestLogger = require("./middleware/logger");
require('dotenv').config();

const { attachUser, reqAuth, isAdmin } = require('./middleware/auth.js');

const homeRouter = require('./routes/client/home');
const aboutRouter = require('./routes/client/about');
const menuRouter = require('./routes/client/menu');
const cartRouter = require('./routes/client/cart');



const app = express();


// Method Override (for PUT/DELETE in forms)
app.use(methodOverride('_method'));
// my custom middleware that just logs any incomming requests
app.use(requestLogger);


connectDB();





app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));




// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(attachUser);
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    if (!req.session.cart) req.session.cart = [];
    res.locals.cartCount = req.session.cart
        .reduce((sum, entry) => sum + (entry.quantity || 1), 0);
    next();
});





// Views will come later under /views
// after `app.use(attachUser);`
app.use('/', homeRouter);
app.use('/about', aboutRouter);
app.use('/menu', menuRouter);
app.use('/cart', cartRouter);
app.use('/', require('./routes/client/auth'));
app.use('/', require('./routes/client/profile'));



// Admin routes
app.use('/admin/users', reqAuth, isAdmin, require('./routes/admin/users'));
app.use('/admin/orders', reqAuth, isAdmin, require('./routes/admin/orders'));
app.use('/admin/items', reqAuth, isAdmin, require('./routes/admin/items'));
app.use('/admin/contacts', reqAuth, isAdmin, require('./routes/admin/contacts'));





// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found', active: '' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500', { title: 'Server Error', active: '' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
