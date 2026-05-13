const mongoose = require('mongoose');

const jobSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    location:{
        type:String,
        required:true,
        trim:true,
    },
    salary:{
        type:String,
        trim:true,          // e.g. "8-12 LPA" or "25k/month"
    },

    skillsRequired:{
        type:[String],
    },
jobType: {
    type: String,
    enum: ["remote", "internship", "part-time", "full-time"],
    default: "full-time",
},
   // company who posted this job
     postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',        // references your User model
        required: true,
    },

        applications: [
        {
            applicant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',    // references applicant
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending',
            },
            appliedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],

     createdAt: {
        type: Date,
        default: Date.now,
    }

    
}
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;