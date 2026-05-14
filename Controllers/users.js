const User = require('../models/user');
const { sendWelcomeEmail } = require('../utils/mailer');

module.exports.RegisterGetRequest = (req, res) => {
    res.render("./auth/register.ejs");
};

module.exports.RegisterPost = async (req, res, next) => {
    console.log('Register started');
    let { name, email, password, role, companyName, companyWebsite, skills } = req.body;
    if (skills) skills = skills.split(',').map(s => s.trim());

    const avatar = req.file ? req.file.path 
        : 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg';
    
    let newUser = new User({
        name, email, role,
        companyWebsite, companyName,
        skills,
        avatar,
    });

    console.log('Registering user...');
    const registeredUser = await User.register(newUser, password);
    console.log('User registered!');
    
    try {
        console.log('Sending email...');
        await sendWelcomeEmail(registeredUser.email, registeredUser.name);
        console.log('Email sent!');
    } catch(emailErr) {
        console.log('Email error:', emailErr.message);
    }

    req.login(registeredUser, (err) => {
        console.log('Logged in!');
        if (err) return next(err);
        req.flash('success', `Welcome to Hire Hub, ${registeredUser.name}!`);
        if (registeredUser.role === 'company') return res.redirect('/company/dashboard');
        return res.redirect('/jobs');
    });
};

module.exports.Login = (req, res) => {
    res.render("./auth/login.ejs");
};

module.exports.PostLogin = (req, res) => {
    req.flash('success', `Welcome back, ${req.user.name}!`);
    if (req.user.role === 'company') return res.redirect('/company/dashboard');
    if (req.user.role === 'applicant') return res.redirect('/jobs');
    res.redirect('/');
};

module.exports.Logout = (req, res, next) => {
    req.logout((e) => {
        if (e) return next(e);
        req.flash('success', 'Logged out successfully!');
        res.redirect("/");
    });
};

module.exports.profile = async (req, res) => {
    const applicant = await User.findById(req.params.id);
    if (!applicant) throw new ExpressError(404, 'Applicant not found!');
    res.render('./applicant/profile.ejs', { applicant });
};