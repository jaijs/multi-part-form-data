const moduleName = 'Express';
const express = require('express');
const uploader = require('../src/index');

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
