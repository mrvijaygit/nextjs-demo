const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const Minio = require('minio');

async function downloadFileFromMinio(filePath, bucketName) {
    try {
        const host = "127.0.0.1";
        const port = 9000;
        const accessKey = "admin";
        const secretKey = "admin1234";

        const client = new Minio.Client({
            endPoint: host,
            port: port,
            accessKey: accessKey,
            secretKey: secretKey,
            useSSL: false,
        });

        const generatedUuid = uuidv4();
        const tempDir = os.tmpdir();
        const tempFilename = path.join(tempDir, generatedUuid);

        console.log("Downloading file...");
        const objectStream = await client.getObject(bucketName, filePath);

        const writeStream = fs.createWriteStream(tempFilename);
        objectStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            objectStream.on('end', resolve);
            objectStream.on('error', reject);
        });

        console.log("File downloaded");
        return tempFilename;
    } catch (error) {
        console.error("Exception occurred:", error);
        return null;
    }
}

module.exports = {
    downloadFileFromMinio
};
