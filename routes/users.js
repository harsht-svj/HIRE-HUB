const express = require('express');
const router = express.Router(); // Create a router instance
const passport=require('passport');
const LocalStrategy = require("passport-local").Strategy; 
const User = require('../models/user');
const wrapasync = require('../utils/wrapasync.js');
const ControllerUser=require('../Controllers/users.js');
const multer = require('../utils/multer.js');




//REGISTER PAGE RENDER 
router.get("/register",ControllerUser.RegisterGetRequest);


//REGISTER POST REQUEST
router.post('/register', multer.single('avatar'), wrapasync(ControllerUser.RegisterPost));


//LOGIN PAGE RENDER


router.get("/login",ControllerUser.Login)


//LOGIN POST REQUEST:
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: " Invalid email or password. Not registered with Hire Hub!",
}), ControllerUser.PostLogin);

//LOGOUT
router.get("/logout",ControllerUser.Logout);




module.exports = router; 