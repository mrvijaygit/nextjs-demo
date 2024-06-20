import { metadata } from "@/app/layout";

const { downloadFileFromMinio } = require('./../../services/file_storage');
const { checkFingerCount } = require('./../../services/finger_count_detector')



export async function POST(request : Request){
    const required_fields = ['file_id', 'bucket_name', 'finger_count_expected']

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
        try {
            const count = await checkFingerCount(imagePath, 3);
            return new Response(JSON.stringify({ fingerCount: count }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
          } catch (error) {
            console.log(error)
            return new Response(JSON.stringify({ error: 'Error detecting hand counts' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
          }
    }else {
        return Response.json({success : false , message : "File download failed", vijay : "FILE_DOWNLOAD_FAILED"});
    }
}


