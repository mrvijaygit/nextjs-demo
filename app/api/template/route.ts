import { metadata } from "@/app/layout";

const { generateFaceTemplate } = require('./../../services/face_compare');
const { downloadFileFromMinio } = require('./../../services/file_storage');



export async function POST(request : Request){
    const required_fields = ['file_id', 'bucket_name']

    const requestJson = await request.json();
    const fileId = requestJson.file_id;
    const bucketName = requestJson.bucket_name;

    for (const field of required_fields) {
        if (!requestJson.hasOwnProperty(field)) {
            return new Response(JSON.stringify({success : true, message: `Missing required key: ${field}`, code : "Field_Missing"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    const  imagePath = await downloadFileFromMinio(fileId, bucketName);

    if(imagePath != null){
        const  result = await generateFaceTemplate(imagePath, bucketName)
        console.log("final Result ->", result)
        return new Response(JSON.stringify({result}), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }else {
        return Response.json({success : false , message : "File download failed", vijay : "FILE_DOWNLOAD_FAILED"});
    }
}


