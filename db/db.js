const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mongoDbUser:3TQSsmEEfTQdnbd@cluster0-mte9s.gcp.mongodb.net/file-uploader?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
