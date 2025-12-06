const cloudinary = require('cloudinary').v2;
const multer = require('multer');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

async function handleImageUploadUtil (filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'ecommerce_products',
        });
        return { success: true, url: result.secure_url };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return { success: false, error: error.message };
    }
}

const upload = multer({storage})

module.exports = {
    handleImageUploadUtil ,
    upload,
};