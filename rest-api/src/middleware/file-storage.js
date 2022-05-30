const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

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

const fileStorage = multer({ storage: fileStorageConfig }).single('file');

module.exports = fileStorage;
