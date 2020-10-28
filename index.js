const express = require('express');
const path = require('path');
const fileRoute = require('./routes/file');
require('./db/db');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(fileRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
