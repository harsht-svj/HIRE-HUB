const express=require('express');
const router=express.Router();
const Job=require('../models/job.js');
const { isLogged, isApplicant } = require('../middleware.js');
const wrapasync = require('../utils/wrapasync.js');
const ApplicantController=require('../Controllers/applicant.js');

router.get('/applicant/dashboard',isLogged,isApplicant,wrapasync(ApplicantController.ApplicantDashBoard));

router.get('/applicant/:id/profile', isLogged, wrapasync(ApplicantController.profile));

router.delete('/jobs/:id/withdraw', isLogged, isApplicant, wrapasync(ApplicantController.withdrawApplication));

module.exports=router;