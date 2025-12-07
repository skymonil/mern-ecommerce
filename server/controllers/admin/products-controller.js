require("dotenv").config();
const { handleImageUploadUtil } = require("../../helpers/cloudinary");

const handleImageUpload = async(req , res) =>{
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const filePath = `data:${req.file.mimetype};base64,${b64}`;
        const result = await handleImageUploadUtil(filePath);
        res.json({
            success: true,
            result,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Image upload failed"});
    }
}

module.exports = {
    handleImageUpload,
};