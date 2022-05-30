const fs = require('fs');
const path = require('path');

const getFilePath = (fileName) => {
  return path.join(__dirname, '..', 'uploads', fileName);
};

exports.deleteFile = (fileName) => {
  const filePath = getFilePath(fileName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.log('Failed to delete file');
    console.log(error);
    throw error;
  }
};
