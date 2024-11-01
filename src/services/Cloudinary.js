const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const streamifier = require("streamifier");

const uploadFileToCloudinary = async (file) => {
  try {
    // Cấu hình Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    // Sử dụng streamifier để chuyển đổi Buffer thành stream
    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: `uploads/shoes-${Date.now()}` },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(file.data).pipe(uploadStream);
      });
    };

    // Gọi hàm streamUpload để tải tệp lên
    const uploadResult = await streamUpload(file);

    console.log("Upload result:", uploadResult);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error; // Ném lỗi ra ngoài nếu có
  }
};
module.exports = {
  uploadFileToCloudinary,
};
