const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../model/file');
const router = express.Router();


// *********************************************** Upload File Function *********************************************
const upload = multer({

  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),

  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },

  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return callback(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    callback(undefined, true); // continue with upload
  }

});

// *********************************************** Upload File *********************************************
router.post('/upload', upload.single('file'), async (req, res) => {

  try {
    const { title, description } = req.body;
    const { path, mimetype } = req.file;
    const file = new File({
      title,
      description,
      file_path: path,
      file_mimetype: mimetype
    });
    await file.save();

    res.send('file uploaded successfully.');

  } catch (error) {

    res.status(400).send('Error while uploading file. Try again later.');

  }

},
  (error, req, res, next) => {

    if (error) {
      res.status(500).send(error.message);
    }

  }

);

// *********************************************** Get All Uploaded Files *********************************************
router.get('/getAllFiles', async (req, res) => {

  try {

    const files = await File.find({});
    const sortedByCreationDate = files.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.send(sortedByCreationDate);

  } catch (error) {

    res.status(400).send('Error while getting list of files. Try again later.');

  }

});

// *********************************************** Get Single Uploaded File *********************************************
router.get('/download/:id', async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    res.set({
      'Content-Type': file.file_mimetype
    });

    res.sendFile(path.join(__dirname, '..', file.file_path));

  } catch (error) {

    res.status(400).send('Error while downloading file. Try again later.');

  }

});

module.exports = router;