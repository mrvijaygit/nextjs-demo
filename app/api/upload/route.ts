const Minio = require('minio')
import * as Fs from 'fs'
import { promises as fsPromises } from 'fs';
import path from 'path';
import * as os from 'os';

const minioClient = new Minio.Client({
    endPoint: "127.0.0.1",
    port: 9000,
    useSSL: false,
    accessKey: "admin",
    secretKey: "admin1234",
  });


export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(request :any) {
  console.log("CODE RUNNING.... 🚀 ");

  const formData = await request.formData();

  const file = formData.get('file'); // Assuming 'file' is the name attribute of your file input field

  console.log("file name", file)

  if (!file || file.size === 0) {
    return { status: 'File not found in request' };
  }

  const metaData = {
    'Content-Type': file.type,
  };

  // Bucket name and object name (file path in MinIO)
  const bucketName = 'subin';
  const objectName = 'subin/' + file.name;

  const tempFilePath = path.join(os.tmpdir(), file.name);

  // Read file content as Buffer
  const fileStream = Fs.createReadStream("/Users/grootan/Goals/demo-app/public/images/app_logo.png")

  // Upload file to MinIO
  try {
    // Write the file content to the temporary path
    await fsPromises.writeFile(tempFilePath, Buffer.from(await file.arrayBuffer()));

    // Read file content as Buffer
    const fileStream = Fs.createReadStream(tempFilePath);

    // Upload file to MinIO
    await minioClient.putObject(bucketName, objectName, fileStream, metaData);
    console.log(`File uploaded successfully to MinIO: ${objectName}`);

    // Remove the temporary file
    await fsPromises.unlink(tempFilePath);

    return Response.json({success : true , message : "File uploaded successfully"});
  } catch (err) {
    console.error('Error uploading file to MinIO:', err);

    // Attempt to remove the temporary file in case of an error
    try {
      await fsPromises.unlink(tempFilePath);
    } catch (unlinkErr) {
      console.error('Error removing temporary file:', unlinkErr);
    }
    return Response.json({success : false , message : "Error uploading file", error : err});
  }
}