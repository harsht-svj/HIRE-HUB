require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@hirehub.com' });
    if (existing) {
        console.log('Admin already exists!');
        process.exit(0);
    }

    const admin = new User({
        name: 'Admin',
        email: 'admin@hirehub.com',
        role: 'admin',
    });

    await User.register(admin, 'admin123');
    console.log('Admin created! Email: admin@hirehub.com | Password: admin123');
    process.exit(0);
}

createAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});