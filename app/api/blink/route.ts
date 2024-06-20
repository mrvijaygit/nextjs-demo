import { metadata } from "@/app/layout";

const { processVideo } = require('./../../services/blink_detector');

const { downloadFileFromMinio } = require('./../../services/file_storage');



export async function POST(request : Request){
    const required_fields = ['file_id', 'bucket_name', 'blink_expected']

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
        const  result = await processVideo(imagePath)
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


