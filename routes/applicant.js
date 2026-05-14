const express=require('express');
const router=express.Router();
const Job=require('../models/job.js');
const { isLogged, isApplicant } = require('../middleware.js');
const wrapasync = require('../utils/wrapasync.js');
const ApplicantController=require('../Controllers/applicant.js');
const multer = require('../utils/multer.js');

router.get('/applicant/dashboard',isLogged,isApplicant,wrapasync(ApplicantController.ApplicantDashBoard));

router.get('/applicant/:id/profile', isLogged, wrapasync(ApplicantController.profile));

router.delete('/jobs/:id/withdraw', isLogged, isApplicant, wrapasync(ApplicantController.withdrawApplication));

router.get('/applicant/:id/edit', isLogged, isApplicant, wrapasync(ApplicantController.editProfileGet));
router.put('/applicant/:id', isLogged, isApplicant, multer.single('avatar'), wrapasync(ApplicantController.editProfilePut));

module.exports=router;