const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;


const userschema= new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    role:{
        type:String,
        enum:['applicant','company','admin'],
        default:'applicant'
    },

    //company related feilds
    companyName:{
        type:String,
        trim:true
    },

    companyWebsite:{
        type:String,
        trim:true,
    },


    //Applicant related field
    skills:{
        type:[String],
    },
    resume:{
        type:String,
    },

    avatar:String,

     createdAt: {
        type: Date,
        default: Date.now
    }

});
userschema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User=mongoose.model("User",userschema);
module.exports=User;