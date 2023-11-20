import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dcie0rjra",
  api_key: "272849945749931",
  api_secret: "_vaEF1AyL9UlBIr5ELsFXWpfqf4",
});

const cloudinaryUploadPhoto = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

export default cloudinaryUploadPhoto;
