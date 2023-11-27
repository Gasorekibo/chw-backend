// // configure multer to specify the file we want to upload, this file will contain other explanation coz it is my first time to work with this library

// import expressAsyncHandler from "express-async-handler";
// import multer from "multer";
// import sharp from "sharp";
// import path from "path";

// // configure image storage: we are going to temporary store our image in multer memory storage

// const multerStorage = multer.memoryStorage();

// // configure the type of file we will allow to be stored

// // How the function below works: The function receive 3 arguments: 1. req, 2.file:this will act as controller of the file uploaded i.e we can have access to the image through file, 3. cb: which is a call back function that controlle if the image upload successfully or if it fails

// const multerFilter = (req, file, cb) => {
//   // configure the type if image using mimetype property. and verify image upload successfull of fails.
//   // a call back null means that nothing went wrong it successfully uploaded image, and true: it is going to return an image

//   if (file.mimetype.startsWith("image")) {
//     // upload success
//     cb(null, true);
//   } else {
//     // upload fails
//     cb({ msg: "unsupport image format." }, false);
//   }
// };

// // configure our middle ware

// const profilePhotoUploadMiddleware = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: {
//     fileSize: 4000000, //Max 4MB
//   },
// });

// // profile image resizing middleware
// const resizeImageMiddleware = expressAsyncHandler(async (req, res, next) => {
//   // if no file uploaded from the above middleware, else we will have access to the image using req.file
//   if (!req.file) {
//     next();
//   } else {
//     // give a file a custom name to prevent upload of similar profile photo;

//     req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
//     await sharp(req.file.buffer)
//       .resize(250, 250)
//       .toFormat("jpeg")
//       .jpeg({
//         quality: 90,
//       })
//       .toFile(path.join(`public/images/profiles/${req.file.filename}`));

//     next();
//   }
// });

// //----------------- post image resizing -------------

// const postImgResizeMiddleware = expressAsyncHandler(async (req, res, next) => {
//   // if no file uploaded from the above middleware, else we will have access to the image using req.file
//   if (!req.file) {
//     next();
//   } else {
//     // give a file a custom name to prevent upload of similar profile photo;

//     req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
//     await sharp(req.file.buffer)
//       .resize(500, 500)
//       .toFormat("jpeg")
//       .jpeg({
//         quality: 90,
//       })
//       .toFile(path.join(`public/images/posts/${req.file.filename}`));

//     next();
//   }
// });

// // ========= Report image =====

// const reportResizeMiddleware = expressAsyncHandler(async (req, res, next) => {
//   // if no file uploaded from the above middleware, else we will have access to the image using req.file
//   if (!req.file) {
//     next();
//   } else {
//     // give a file a custom name to prevent upload of similar profile photo;

//     req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
//     await sharp(req.file.buffer)
//       .resize(500, 500)
//       .toFormat("jpeg")
//       .jpeg({
//         quality: 90,
//       })
//       .toFile(path.join(`public/images/reports/${req.file.filename}`));

//     next();
//   }
// });

// export {
//   profilePhotoUploadMiddleware,
//   resizeImageMiddleware,
//   postImgResizeMiddleware,
//   reportResizeMiddleware
// };

import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Function to create a directory if it doesn't exist
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Configure image storage: we are going to temporarily store our image in multer memory storage
const multerStorage = multer.memoryStorage();

// Configure the type of file we will allow to be stored

// How the function below works: The function receives 3 arguments: 1. req, 2.file: this will act as the controller of the file uploaded, i.e., we can have access to the image through file, 3. cb: which is a callback function that controls if the image upload was successful or if it fails

const multerFilter = (req, file, cb) => {
  // Configure the type of image using the mimetype property and verify image upload success or failure.
  // A callback with null means that nothing went wrong; it successfully uploaded the image. True: it is going to return an image

  if (file.mimetype.startsWith("image")) {
    // Upload success
    cb(null, true);
  } else {
    // Upload fails
    cb({ msg: "Unsupported image format." }, false);
  }
};

// Configure our middleware

const profilePhotoUploadMiddleware = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 4000000, // Max 4MB
  },
});

// Profile image resizing middleware
const resizeImageMiddleware = expressAsyncHandler(async (req, res, next) => {
  // If no file uploaded from the above middleware, move to the next middleware
  if (!req.file) {
    next();
  } else {
    // Construct the output directory path
    const outputDirectory = path.join(__dirname, 'public/images/profiles/');

    // Create the directory if it doesn't exist
    createDirectoryIfNotExists(outputDirectory);

    // Give a file a custom name to prevent the upload of similar profile photo;
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    // Resize and save the image
    await sharp(req.file.buffer)
      .resize(250, 250)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(path.join(outputDirectory, req.file.filename));

    next();
  }
});

// Post image resizing middleware

const postImgResizeMiddleware = expressAsyncHandler(async (req, res, next) => {
  // If no file uploaded from the above middleware, move to the next middleware
  if (!req.file) {
    next();
  } else {
    // Construct the output directory path
    const outputDirectory = path.join(__dirname, 'public/images/posts/');

    // Create the directory if it doesn't exist
    createDirectoryIfNotExists(outputDirectory);

    // Give a file a custom name to prevent the upload of similar profile photo;
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    // Resize and save the image
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(path.join(outputDirectory, req.file.filename));

    next();
  }
});

// Report image resizing middleware

const reportResizeMiddleware = expressAsyncHandler(async (req, res, next) => {
  // If no file uploaded from the above middleware, move to the next middleware
  if (!req.file) {
    next();
  } else {
    // Construct the output directory path
    const outputDirectory = path.join(__dirname, 'public/images/reports/');

    // Create the directory if it doesn't exist
    createDirectoryIfNotExists(outputDirectory);

    // Give a file a custom name to prevent the upload of similar profile photo;
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    // Resize and save the image
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(path.join(outputDirectory, req.file.filename));

    next();
  }
});

export {
  profilePhotoUploadMiddleware,
  resizeImageMiddleware,
  postImgResizeMiddleware,
  reportResizeMiddleware
};
