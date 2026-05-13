const express = require('express');
const router = express.Router(); // Create a router instance
const Job = require('../models/job.js');
const {isLogged,iscompany,isApplicant}=require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const jobController=require('../Controllers/jobs.js');

//SHOW ALL THE JOBS  -ANY ONE CAN SEE EVEN IF NOT LOGGED IN 

// populate('postedBy', 'companyName');  THIS WILL REPLACE THE COMPANY ID WITH THE COMPANY NAME
router.get('/jobs', wrapAsync(jobController.Alljobs));

//CREATE A NEW JOB  - ONLY FOR COMPANY +LOGGED IN
router.get("/jobs/new",isLogged,iscompany,jobController.newJobForm)  ;

// POST NEW JOB - ONLY FOR COMPANY +LOGGED IN
router.post("/jobs",isLogged,iscompany,wrapAsync(jobController.newJobPost));



//VIEW A JOB IN DETAIL  - ANYONE CAN SEE  BUT SHOULD BE LOGGED IN
router.get("/jobs/:id",isLogged,wrapAsync(jobController.ViewInDetail));

//Applicant apply to a new job  -APPLICANT ONLY
router.post('/jobs/:id/apply',isLogged,isApplicant, wrapAsync(jobController.NewJobApply));


//Comany Profile Page
router.get('/jobs/:id/companyprofile', isLogged, wrapAsync(jobController.companyProfile));




module.exports = router;