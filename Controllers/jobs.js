
const Job = require('../models/job.js');
const ExpressError = require('../utils/ExpressError.js');

module.exports.Alljobs=async (req, res) => {
    const jobs = await Job.find().populate('postedBy', 'companyName');
    res.render('./jobs/index.ejs', { jobs });
    
};

module.exports.newJobForm=(req,res)=>{
           res.render('./jobs/new.ejs');
};

module.exports.newJobPost=async(req,res)=>{

      let { title, location, jobType, salary, skillsRequired, description } = req.body;

        if (skillsRequired) skillsRequired = skillsRequired.split(',').map(s => s.trim());

  let newJob = new Job({
            title,
            location,
            jobType,
            salary,
            skillsRequired,
            description,
            postedBy: req.user._id,   // company who is logged in
        });

    console.log(newJob);
    await newJob.save();
     req.flash('success', 'Job posted successfully!');
    res.redirect('/jobs');
};


module.exports.ViewInDetail=async(req,res)=>{
    const {id}=req.params;
 const job = await Job.findById(id).populate('postedBy', 'companyName companyWebsite');
 if(!job)throw new ExpressError(404, "Job not found!");
    res.render('./jobs/show.ejs',{job});
};

module.exports.NewJobApply=async (req, res) => {
  
        const { id } = req.params;
        const job = await Job.findById(id);

        // check if already applied
        const alreadyApplied = job.applications.some(
            app => app.applicant.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            req.flash('error', 'You have already applied to this job!');
            return res.redirect(`/jobs/${id}`);
        }

        job.applications.push({
            applicant: req.user._id,
        });

        await job.save();
        req.flash('success', 'Applied successfully!');
        res.redirect(`/jobs/${id}`);


};

//COMPANY PROFILE PAGE 
module.exports.companyProfile = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('postedBy');
    if (!job) throw new ExpressError(404, 'Job not found!');
    
    // get all jobs by this company
    const companyJobs = await Job.find({ postedBy: job.postedBy._id });
    
    res.render('./company/profile.ejs', { company: job.postedBy, companyJobs });
};
