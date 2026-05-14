
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,  // force IPv4
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports.sendWelcomeEmail = async (toEmail, name) => {
    await transporter.sendMail({
        from: `"Hire Hub" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Welcome to Hire Hub! 🎉',
        html: `
            <h2>Welcome, ${name}!</h2>
            <p>Thanks for joining <b>Hire Hub</b>. Your account has been created successfully.</p>
            <p>Start exploring jobs and opportunities today!</p>
            <br/>
            <a href="https://hire-hub-n8dx.onrender.com/jobs">Browse Jobs</a>
        `,
    });
};

module.exports.sendStatusEmail = async (toEmail, replyToEmail, applicantName, jobTitle, status) => {
    const isAccepted = status === 'accepted';
    await transporter.sendMail({
        from: `"Hire Hub" <${process.env.EMAIL_USER}>`,
        replyTo: replyToEmail,
        to: toEmail,
        subject: `Application ${isAccepted ? 'Accepted 🎉' : 'Rejected ❌'} - ${jobTitle}`,
        html: `
            <h2>Hi ${applicantName},</h2>
            <p>Your application for <b>${jobTitle}</b> has been 
            <b style="color:${isAccepted ? 'green' : 'red'}">${status.toUpperCase()}</b>.</p>
            ${isAccepted 
                ? '<p>🎉 Congratulations! The company will contact you soon.</p>' 
                : '<p>Don\'t give up! Keep applying to other jobs.</p>'}
            <br/>
            <a href="https://hire-hub-n8dx.onrender.com/jobs" 
               style="background:#4F46E5;color:white;padding:10px 20px;border-radius:5px;text-decoration:none">
               Browse More Jobs
            </a>
        `,
    });
};

// Add this at the bottom of mailer.js
transporter.verify((error, success) => {
    if (error) {
        console.log('Mailer error:', error);
    } else {
        console.log('Mailer ready ✅');
    }
});