const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

let storage = cloudinaryStorage({
  cloudinary,
  folder: 'folder-name', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  // transformation: [{ height: 380, width: 380, crop: "imagga_crop", sign_url: true }],
  filename(req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  },
});



const uploadCloud = multer({
  storage,
});

module.exports = uploadCloud;




                