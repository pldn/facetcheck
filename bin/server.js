
/**
 * This server is to run your build locally
 */

const express = require('express');
const path = require('path');
const fs = require('fs')
const port = process.env.PORT || 5000;
const app = express();

const basename = process.env.BASENAME || ""
console.log('basename on server', basename)
// serve static assets normally
app.use(basename, express.static(`${__dirname}/../build/assets/dist`));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', (request, response) => {
  // console.log(fs.readFileSync(`${__dirname}/../build/assets/dist/index.html`, 'utf8'))
  response.sendFile(path.resolve(`${__dirname}/../build/assets/dist/index.html`));
});

app.listen(port);
console.log(`server started on port ${port}`);
