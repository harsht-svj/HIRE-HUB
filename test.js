require('dotenv').config();
const mongoose = require('mongoose');

console.log("Connecting to:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.log("Error:", err.message);
        process.exit(1);
    });