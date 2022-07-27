const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const os = require('os');

function saveFiles(options, fileData, buffer) {
  const data = fileData;
  data.destination = options.destination;
  if (typeof options.destination !== 'string') {
    data.destination = os.tmpdir();
  }

  try {
    mkdirp.sync(data.destination);
  } catch (err) {
    data.error = new Error('Error creating destination folder');
    return data;
  }

  options.filename(data, (err, fileName) => {
    if (err) {
      data.error = err;
    }
    data.fileName = fileName;
    data.path = path.join(data.destination, fileName);

    fs.writeFile(data.path, buffer, (writeError) => {
      if (writeError) {
        data.error = writeError;
      }
    });
    return data;
  });
  return data;
}

module.exports = saveFiles;
