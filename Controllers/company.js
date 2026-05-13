
const express=require('express');
const router=express.Router();
const Job=require('../models/job.js');
const ExpressError = require('../utils/ExpressError.js');

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

module.exports.UpdateStatus=async(req,res)=>{
             let {jobId,applicantId}=req.params;
                let {status}=req.body;

                let job=await Job.findById(jobId);
              let application = job.applications.find(
                  app => app.applicant.toString() === applicantId
                 );

        application.status = status;
        await job.save();
             req.flash('success', 'Applicant status updated!');
             res.redirect('/company/dashboard');

    
};


