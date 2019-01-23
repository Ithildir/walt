const { Storage } = require('@google-cloud/storage');
const os = require('os');
const path = require('path');
const logger = require('../logger');

const BUCKET_NAME = `${process.env.GOOGLE_CLOUD_PROJECT}.appspot.com`;

logger.info(`Using GCS storage at ${BUCKET_NAME}`);

const storage = new Storage();

async function downloadFile(name) {
  const destination = path.join(os.tmpdir(), name);

  const file = storage.bucket(BUCKET_NAME).file(name);

  const [exists] = await file.exists();
  if (exists) {
    await file.download({ destination });
    logger.debug(`Downloaded ${name} from GCS into ${destination}`);
  }

  return destination;
}

async function uploadFile(source) {
  await storage.bucket(BUCKET_NAME).upload(source, { resumable: false });
  logger.debug(`Uploaded ${source} into GCS`);
}

module.exports = {
  downloadFile,
  uploadFile,
};
