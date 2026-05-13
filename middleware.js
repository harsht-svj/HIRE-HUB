const ExpressError = require('./utils/ExpressError.js');

module.exports.isLogged = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

module.exports.iscompany = (req, res, next) => {
    if (req.user.role !== 'company') {
        throw new ExpressError(403, "Access denied! Companies only.");
    }
    next();
};

module.exports.isApplicant = (req, res, next) => {
    if (req.user.role !== 'applicant') {
        throw new ExpressError(403, "Access denied! Applicants only.");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        throw new ExpressError(403, 'Access denied! Admins only.');
    }
    next();
};