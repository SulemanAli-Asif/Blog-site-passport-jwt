const express = require('express');
const app = express();
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const expressLayout = require('express-ejs-layouts');
const { connectDb } = require('./server/DB/connect');
const cookieSession = require('cookie-session'); // Use cookie-session
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const session = require('express-session');

dotenv.config();

// Set up cookie session middleware before initializing Passport and routes
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));
// Initialize Passport after setting up session middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Other middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to the database
const url = process.env.MONGO_URI;
connectDb(url);

// Routes
app.use('/', require('./server/Routes/routes'));
app.use('/', require('./server/Routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
