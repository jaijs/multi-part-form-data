const path = require('path');
const mimeDB = require('mime-db');
const saveFiles = require('./saveFiles');

const allMimeWithExtension = Object.keys(mimeDB).map((x) => {
  if (mimeDB[x].extensions) {
    return { ...mimeDB[x], mime: x };
  }
  return undefined;
}).filter((x) => x);

const mimeDBLength = allMimeWithExtension.length;
function mimeWithExtension(extension) {
  for (let i = 0; i < mimeDBLength; i += 1) {
    if (allMimeWithExtension[i].extensions.includes(extension)) {
      return allMimeWithExtension[i].mime;
    }
  }
  return 'application/octet-stream';
}

function reqBodyMaker(name, buffer, obj) {
  const result = obj;
  const data = Buffer.isBuffer(buffer) ? buffer.toString() : buffer;

  if (typeof result[name] !== 'undefined') {
    if (result[name] instanceof Array) {
      result[name].push(data);
    } else {
      result[name] = [result[name], data];
    }
  } else {
    result[name] = data;
  }
  return result;
}

function Parser(reader, options, result = {}) {
  const nLength = '\r\n'.length;
  const boundary = reader.subarray(0, reader.indexOf('\r\n'));
  // Index of the first boundary
  const boundaryIndex = 0;

  // Buffer after the boundary
  const currentReader = reader.subarray(boundaryIndex + boundary.length + nLength);
  // Index of the  boundary End or Start of next boundary
  const boundaryEndIndex = currentReader.indexOf(`\r\n${boundary}`);
  const isEND = boundaryEndIndex === currentReader.indexOf(`\r\n${boundary}--\r\n`);

  const contentDetails = currentReader.subarray(currentReader.indexOf('Content-Disposition'), currentReader.indexOf('\r\n'));
  const name = contentDetails.subarray(contentDetails.indexOf('name="') + 'name="'.length, contentDetails.indexOf('"; filename="') || contentDetails.indexOf('\r\n')).toString();
  const isFile = contentDetails.includes(' filename="');
  const filename = contentDetails.subarray(contentDetails.indexOf('filename="') + 'filename="'.length, currentReader.indexOf('"\r\nContent-Type')).toString();

  const buffer = currentReader.subarray(currentReader.indexOf('\r\n\r\n') + 4, boundaryEndIndex);

  // WHEN Not a File
  // When not a file or empty file
  if (!isFile || filename === '') {
    reqBodyMaker(name, buffer, result);
    if (!isEND) {
      return Parser(currentReader.subarray(boundaryEndIndex + nLength), options, result);
    }
    return result;
  }
  // WHEN a File

  // Files
  const extension = path.extname(filename.toString());
  const size = buffer.length;
  const encoding = 'utf8';
  const mimetype = mimeWithExtension(extension.toLowerCase().slice(1));
  const data = {
    filename,
    mimetype,
    size,
    encoding,
    //   buffer: buffer,
    extension,
    error: null,
  };
    // invalid File extension

  if (!options.allowedExtensions.includes(extension.toLowerCase().substring(1))) {
    data.error = new Error('File Extension not allowed');
    reqBodyMaker(name, data, result);
    if (!isEND) {
      return Parser(currentReader.subarray(boundaryEndIndex + nLength), options, result);
    }
    return result;
  } if (size > options.maxSize) {
    data.error = new Error('File Size too big');
    reqBodyMaker(name, data, result);
    if (!isEND) {
      return Parser(currentReader.subarray(boundaryEndIndex + nLength), options, result);
    }
    return result;
  }
  reqBodyMaker(name, data, result);
  saveFiles(options, data, buffer);
  if (!isEND) {
    return Parser(currentReader.subarray(boundaryEndIndex + nLength), options, result);
  }

  return result;
}

module.exports = Parser;
