const multer = require('multer');
const { storage } = require('./Cloudinary.js');

module.exports = multer({ storage });