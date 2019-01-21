const redis = require('./redis');
const { downloadFile, uploadFile } = require('./storage');

module.exports = {
  downloadFile,
  redis,
  uploadFile,
};
