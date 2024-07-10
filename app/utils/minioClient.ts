import Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: "admin",
  secretKey: "admin1234",
});

module.exports = minioClient;
