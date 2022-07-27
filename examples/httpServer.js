const moduleName = 'http';
const http = require('http');
const uploader = require('../src/index');

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
