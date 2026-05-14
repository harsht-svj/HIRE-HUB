const express=require('express');
const router=express.Router();
const Job=require('../models/job.js');
const User=require('../models/user.js');
const ExpressError = require('../utils/ExpressError.js');

// module.exports.ApplicantDashBoard=async(req,res)=>{
//     const jobs=await Job.find({'applications.applicant':req.user._id}).populate('postedBy','companyName companyWebsite');

//        res.render('./applicant/dashboard.ejs', { jobs });
// };

//APPLICATION DASHBOARD WITH RECOMENDATION
module.exports.ApplicantDashBoard = async (req, res) => {
    const jobs = await Job.find({ 'applications.applicant': req.user._id })
        .populate('postedBy', 'companyName companyWebsite');

    const skills = req.user.skills || [];
    
    console.log("User skills:", skills);  // ← add this
    
let recommendedJobs = [];
if (skills.length > 0) {
    // convert user skills to regex for case insensitive matching
    const skillRegex = skills.map(skill => new RegExp(skill, 'i'));
    
    recommendedJobs = await Job.find({
        skillsRequired: { $in: skillRegex },
        'applications.applicant': { $ne: req.user._id }
    }).populate('postedBy', 'companyName').limit(6);
    
    console.log("Recommended jobs found:", recommendedJobs.length);
}
    res.render('./applicant/dashboard.ejs', { jobs, recommendedJobs });
};


//  APPLICATION-PROFILE:
module.exports.profile=async(req,res)=>{
          const { id } = req.params;
          const applicant=await User.findById(id);
          if(!applicant){
            req.flash("error","The applicant you are trying to see no longer exist");
            res.redirect('/company/dashboard');
          }
          res.render('./applicant/profile.ejs',{applicant});
}

//APPLICATION-WITHDRWAL
module.exports.withdrawApplication = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);

    // remove applicant from applications array
    job.applications = job.applications.filter(
        app => app.applicant.toString() !== req.user._id.toString()
    );

    await job.save();
    req.flash('success', 'Application withdrawn successfully!');
    res.redirect('/applicant/dashboard');
};


// GET ROUTE FOR EDIT FORM RENDER:
module.exports.editProfileGet = async (req, res) => {
    const applicant = await User.findById(req.params.id);
    if (!applicant) throw new ExpressError(404, 'Applicant not found!');
    res.render('./applicant/edit.ejs', { applicant });
};

module.exports.editProfilePut = async (req, res) => {
    const { id } = req.params;
    let { name, skills, resume } = req.body;

    if (skills) skills = skills.split(',').map(s => s.trim());

    const avatar = req.file ? req.file.path : req.body.existingAvatar;

    await User.findByIdAndUpdate(id, {
        name,
        skills,
        resume,
        avatar,
    });

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/applicant/dashboard');
};