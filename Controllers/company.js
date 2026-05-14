
const express=require('express');
const router=express.Router();
const Job=require('../models/job.js');
const ExpressError = require('../utils/ExpressError.js');
const User=require('../models/user.js');
const { sendStatusEmail } = require('../utils/mailer');

module.exports.CompanyDashBoard=async(req,res)=>{

    const jobs=await Job.find({postedBy:req.user._id}).populate('applications.applicant','name email skills');

    res.render('./company/dashboard.ejs',{jobs});
};

module.exports.UpdateJobGet=async (req, res) => {
  
        const job = await Job.findById(req.params.id);
        if(!job){
           throw new ExpressError(404, "Job not found!");
        }
        // only the company who posted can edit
        if (job.postedBy.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to edit this job!');
            return res.redirect('/company/dashboard');
        }

        res.render('./company/edit.ejs', { job });
  
};


module.exports.UpdateJobPut=async (req, res) => {

        const { id } = req.params;
        let { title, location, jobType, salary, skillsRequired, description } = req.body;

           console.log("jobType received:", jobType); // ← add this
    console.log("full body:", req.body);        // ← add this
        if (skillsRequired) skillsRequired = skillsRequired.split(',').map(s => s.trim());

        const job = await Job.findById(id);

        // only the company who posted can update
        if (job.postedBy.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to edit this job!');
            return res.redirect('/company/dashboard');
        }

     await Job.findByIdAndUpdate(id, {
    title,
    location,
    jobType,
    salary,
    skillsRequired,
    description
}, { new: true });

const updatedJob = await Job.findById(id);
console.log("After update jobType:", updatedJob.jobType);

        req.flash('success', 'Job updated successfully!');
        res.redirect('/company/dashboard');

};

module.exports.DeleteJob=async(req,res)=>{
    let {id}=req.params;
    let job=await Job.findByIdAndDelete(id);
    req.flash('success','Job deleted Successfully');
    res.redirect('/company/dashboard');

};


// GET ROUTE FOR EDIT FORM RENDER:
module.exports.editProfileGet = async (req, res) => {
    const company = await User.findById(req.params.id);
    if (!company) throw new ExpressError(404, 'Company not found!');
    res.render('./company/companyprofile.ejs', { company });
};

module.exports.editProfilePut = async (req, res) => {
    const { id } = req.params;
    const { companyName, currentPassword, newPassword } = req.body;

    const avatar = req.file ? req.file.path : req.body.existingAvatar;

    await User.findByIdAndUpdate(id, {
        companyName,
        avatar,
    });

    if (newPassword) {
        try {
            const user = await User.findById(id);
            await user.changePassword(currentPassword, newPassword);
            await user.save();
        } catch (err) {
            req.flash('error', 'Current password is incorrect!');
            return res.redirect(`/company/${id}/edit`);
        }
    }

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/company/dashboard');
};

//EMAIL NOTIFCATION ON STATUS UPDATE 

module.exports.UpdateStatus = async (req, res) => {
    console.log('UpdateStatus called');
    let { jobId, applicantId } = req.params;
    let { status } = req.body;
    console.log('jobId:', jobId, 'applicantId:', applicantId, 'status:', status);

    let job = await Job.findById(jobId);
    console.log('Job found:', job ? 'yes' : 'no');
    
    let application = job.applications.find(
        app => app.applicant.toString() === applicantId
    );
    console.log('Application found:', application ? 'yes' : 'no');

    application.status = status;
    await job.save();
    console.log('Job saved!');

    try {
        const applicant = await User.findById(applicantId);
        console.log('Sending status email to:', applicant.email);
        await sendStatusEmail(
            applicant.email,
            req.user.email,
            applicant.name,
            job.title,
            status
        );
        console.log('Status email sent!');
    } catch(emailErr) {
        console.log('Email error:', emailErr.message);
    }

    req.flash('success', 'Applicant status updated!');
    res.redirect('/company/dashboard');
};