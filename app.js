require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const User = require('./models/user.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const sessionOption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    }
};

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

const userRouter = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const companyRoutes = require('./routes/company');
const ApplicantRoutes = require('./routes/applicant');
const adminRoutes = require('./routes/admin.js');

app.use('/', userRouter);
app.use('/', jobRoutes);
app.use('/', companyRoutes);
app.use('/', ApplicantRoutes);
app.use('/', adminRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('error.ejs', {
        statusCode: 404,
        message: "Page not found!",
        description: "The page you are looking for doesn't exist."
    });
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', {
        statusCode,
        message,
        description: "An unexpected error occurred. Please try again."
    });
});

// Connect to DB, then start server
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

main()
    .then(() => {
        console.log("Mongoose connection successful");
        app.listen(process.env.PORT || 8080, () => {
            console.log("App listening on port " + (process.env.PORT || 8080));
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });