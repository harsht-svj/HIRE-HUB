const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

let storage;

try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'hirehub',
            allowed_formats: ['jpg', 'jpeg', 'png'],
        },
    });
} catch {
    // fallback for local dev - use disk storage
    const multer = require('multer');
    storage = multer.diskStorage({
        destination: './public/uploads/',
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    });
}

module.exports = { cloudinary, storage };