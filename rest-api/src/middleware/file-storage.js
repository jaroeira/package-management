const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

const filter = (req, file, cb) => {
  console.log('file filter', file.mimetype);
  const fileTypes = /zip|tar|bin|rar|7z/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: invalid file type');
};

const fileStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    cb(null, uuid.v1() + '.' + extension);
  },
});

const fileStorage = multer({
  storage: fileStorageConfig,
  fileFilter: filter,
}).single('file');

module.exports = fileStorage;
