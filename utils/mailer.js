const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports.sendWelcomeEmail = async (toEmail, name) => {
    await resend.emails.send({
        from: 'Hire Hub <onboarding@resend.dev>',
        to: toEmail,
        subject: 'Welcome to Hire Hub! 🎉',
        html: `
            <h2>Welcome, ${name}!</h2>
            <p>Thanks for joining <b>Hire Hub</b>!</p>
            <p>Start exploring jobs today!</p>
            <a href="https://hire-hub-oikh.onrender.com/jobs">Browse Jobs</a>
        `,
    });
};

module.exports.sendStatusEmail = async (toEmail, replyToEmail, applicantName, jobTitle, status) => {
    const isAccepted = status === 'accepted';
    await resend.emails.send({
        from: 'Hire Hub <onboarding@resend.dev>',
        replyTo: replyToEmail,
        to: toEmail,
        subject: `Application ${isAccepted ? 'Accepted 🎉' : 'Rejected ❌'} - ${jobTitle}`,
        html: `
            <h2>Hi ${applicantName},</h2>
            <p>Your application for <b>${jobTitle}</b> has been 
            <b style="color:${isAccepted ? 'green' : 'red'}">${status.toUpperCase()}</b>.</p>
            ${isAccepted 
                ? '<p>🎉 Congratulations! The company will contact you soon.</p>' 
                : '<p>Keep applying to other jobs!</p>'}
            <a href="https://hire-hub-oikh.onrender.com/jobs">Browse More Jobs</a>
        `,
    });
};