const express=require('express');
const router=express.Router();
const Job=require('../models/job.js');

const { isLogged, iscompany } = require('../middleware.js');
const wrapasync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const ControllerCompany= require('../Controllers/company.js');

//COMPANY DASHBOARD 
router.get("/company/dashboard",isLogged,iscompany,wrapasync(ControllerCompany.CompanyDashBoard));

//JOB UPDATE FORM
router.get('/jobs/:id/edit', isLogged, iscompany, wrapasync(ControllerCompany.UpdateJobGet));

// PUT REQUEST FROM COMPANY 
router.put('/jobs/:id', isLogged, iscompany,wrapasync(ControllerCompany.UpdateJobPut));

//JOB DELETE ROUTE
router.delete("/jobs/:id",isLogged,iscompany,wrapasync(ControllerCompany.DeleteJob));

//COMPANY -ACCEPT OR REJECT THE STATUS FOR AN APPLICANT 
router.post('/jobs/:jobId/applications/:applicantId/status',isLogged,iscompany,wrapasync(ControllerCompany.UpdateStatus));

module.exports=router;