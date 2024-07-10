// server.js

const express = require('express');
const multer = require('multer');
const { Client } = require('minio');
const bodyParser = require('body-parser');

const app = express();
const port = 3002;

// Configure MinIO client

const minioClient = new Client({
    endPoint : "127.0.0.1",
    port : 9001,
    accessKey : "admin",
    secretKey : "admin1234",
    useSSL: false,
  });


// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const bucketName = 'vijay';
  const objectName = file.originalname;
  const metaData = {
    'Content-Type': file.mimetype
  };

  minioClient.putObject(bucketName, objectName, file.buffer, file.size, metaData, (err, etag) => {
    if (err) {
      console.log('Error uploading to MinIO:', err);
      return res.status(500).send('Error uploading to MinIO');
    }
    console.log('File uploaded successfully to MinIO with etag:', etag);
    res.send('File uploaded successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
