const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // ✅ destructure it

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {                          // ✅ v2 uses 'params', not direct 'folder'
        folder: 'hirehub',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

module.exports = { cloudinary, storage };