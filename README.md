
# Multi Part Form Data Upload
A full fledge node js module for parsing the multipart/form data.



## Features

- Parse Multiple Files, and uploads them to desired location
- Parse Non File fields
- No need for extra plugin to parse text fields
- Parse & Return all fields exactly as they are on browser from
- Fast  and can work with any framework





## Installation

Install my-project with npm

```bash
  npm install multi-part-form-data-upload
```

### Usage

```javascript
// Express
const uploader = require('multi-part-form-data-upload')(options /* config options */ );
const app = express();

app.post('/uploads',uploader, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ body: req.body }));
});

//  OR Http

const http = require('http');
const uploader = require('multi-part-form-data-upload')(options /* config options */ );

const server = http.createServer(async (req, res) => {
  if (req.url === '/uploads' && req.method.toLowerCase() === 'post') {
    await uploader(req, res, () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ body: req.body }));
    });
    return;
  }
}
```
    
## Usage/Examples

### Node.js Http Module
```javascript
const moduleName = 'http';
const http = require('http');
const uploader = require('multi-part-form-data-upload');

const server = http.createServer(async (req, res) => {
  if (req.url === '/uploads' && req.method.toLowerCase() === 'post') {
    await uploader(/* configs */)(req, res, () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ body: req.body }));
    });
    return;
  }

  // Upload Form HTML
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
  <h1>MultiPartFormData with Node.js <code>"${moduleName}"</code> module</h1>

  <form action="/uploads" enctype="multipart/form-data" method="post">
    <div>Text field title: <input type="text" name="title" /></div>
    <div>MultipleFiles: <input type="file" name="multipleFiles" multiple="multiple" /></div>
    <div>File1: <input type="file" name="file1" /></div>
    <div>File2: <input type="file" name="file2"  /></div>
    <input type="submit" value="Upload" />
  </form>
  `);
});

server.listen(1111, () => {
  console.log('Server listening on http://localhost:1111/ ...');
});

```


### Node.js Express.js Server as middleware
```javascript
const moduleName = 'Express';
const express = require('express');
const uploader = require('multi-part-form-data-upload');

const app = express();
const port = 1111;

app.post('/uploads', uploader(/* configs */), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ body: req.body }));
});

app.get('*', (req, res) => {
  res.send(`
  <h1>MultiPartFormData with Node.js <code>"${moduleName}"</code> module</h1>

  <form action="/uploads" enctype="multipart/form-data" method="post">
    <div>Text field title: <input type="text" name="title" /></div>
    <div>MultipleFiles: <input type="file" name="multipleFiles" multiple="multiple" /></div>
    <div>File1: <input type="file" name="file1" /></div>
    <div>File2: <input type="file" name="file2"  /></div>
    <input type="submit" value="Upload" />
  </form>
`);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/ ...`);
});

```

## API Reference

### Options


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `destination` | `string` |  destination folder path, default: temp folder |
| `filename` | `function` |  function(file, cb){ return cb(err/null, filename)}|
| `allowedExtensions` | `array` |  array of allowed extension types, default ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp', 'doc'] |
| `maxSize` | `integer` |  max file size in bytes, default 10000000. (10MB)

#### Options.filename : args

```javascript
const uploader = require('../src/index')(
    {
        filename:function(file, cb){
            return cb(err, filename)
        }
    }
 );
```

##### file:(object)
| Property | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `filename` | `string` |  original file name |
| `mimetype` | `string` |  file mimetype|
| `size` | `number` |  size in bytes |
| `encoding` | `string` |  file encoding used|
| `destination` | `string` |  file upload folder|
| `path` | `string` |  complete path to saved file|


##### cb: callback function
| Argument | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `err` | `error|null` |  pass error or null |
| `filename` | `string` |  final filename for the file|

### Author: [@hsk11](https://github.com/hsk11)
---
[![Twitter Follow](https://img.shields.io/twitter/follow/Harpalsingh_11?label=Follow)](https://twitter.com/intent/follow?screen_name=Harpalsingh_11)
[![Linkedin: Harpal Singh](https://img.shields.io/badge/-harpalsingh11-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/harpalsingh11)](https://www.linkedin.com/in/harpalsingh11/)
[![GitHub followers](https://img.shields.io/github/followers/hsk11?label=Follow&style=social)](https://github.com/hsk11)
---
