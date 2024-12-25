import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// configuration function
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

const uploadFile = async (filePath) => {
  try {
    if (!filePath) return null;

    // Call the configuration function
    configureCloudinary();

    const response = await cloudinary.uploader.upload(filePath, {
      folder: "ConvoSpace",
      resource_type: "auto"
    })

    // remove locally saved temporary file as it is uploaded successfully 
    fs.unlinkSync(filePath)

    return response;
  } catch (error) {
    // remove locally saved temporary file as the upload operation got failed
    fs.unlinkSync(filePath)
    return null
  }
}

export { uploadFile };