const User = require('../models/user.js');
const Job = require('../models/job.js');

module.exports.dashboard = async (req, res) => {
    const users = await User.find({});
    const jobs = await Job.find({}).populate('postedBy', 'companyName');

    const totalUsers = users.length;
    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((acc, job) => acc + job.applications.length, 0);
    const companies = users.filter(u => u.role === 'company');
    const applicants = users.filter(u => u.role === 'applicant');

    res.render('./admin/dashboard.ejs', {
        users, jobs,
        totalUsers, totalJobs,
        totalApplications,
        companies, applicants
    });
};

module.exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User deleted successfully!');
    res.redirect('/admin/dashboard');
};

module.exports.deleteJob = async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    req.flash('success', 'Job deleted successfully!');
    res.redirect('/admin/dashboard');
};