const multer = require('multer');
const { storage } = require('./cloudinary.js');

module.exports = multer({ storage });