const os = require('os');
const Parser = require('./parser');

const options = {
  destination: os.tmpdir(),
  filename(file, cb) {
    return cb(null, file.filename);
  },
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp', 'doc'],
  maxSize: 10000000, // 10MB
};

async function handler(req, res, next) {
  try {
    const isMultipart = req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data');
    // If not multipart, next()

    if (!isMultipart) {
      return next();
    }
    const chunks = [];

    const obj = await new Promise((resolve, reject) => {
      req.onError = (err) => {
        reject(err);
      };
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', async () => {
        try {
          resolve(Parser(Buffer.concat(chunks), options));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.body = obj;
    return next();
  } catch (err) {
    return next(err);
  }
}

function uploader(customOptions = {}) {
  Object.assign(options, customOptions); // Will override default options

  return handler;
}

module.exports = uploader;
