import { metadata } from "@/app/layout";

const { downloadFileFromMinio } = require('./../../../services/file_storage');

export async function POST(request : Request){
    const required_fields = ['file_id', 'bucket_name', 'expected', 'metadata', 'hook_url', 'action_token']

    const user = await request.json();
    const expected = user.expected;
    const metadata = user.metadata;


    for (const field of required_fields) {
        if (!user.hasOwnProperty(field)) {
            return new Response(JSON.stringify({success : true, message: `Missing required key: ${field}`, code : "Field_Missing"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    const  videoPath = await downloadFileFromMinio(user.file_id, user.bucket_name)

    if(videoPath != null){
        console.log("Video path ->", videoPath)
        for(const key in expected) {
            const videoInterval = metadata[key].video;

            if(key === "blink"){
                const blinkExpected = expected[key].expected;
                const result = await liveVideoInterval(videoPath, videoInterval);
                if(result){

                }else{
                    return Response.json({success : false , message : "File download failed", vijay : "FILE_DOWNLOAD_FAILED"});
                }
            }
        }

    } else{
        return Response.json({success : false , message : "File download failed", vijay : "FILE_DOWNLOAD_FAILED"});
    }
    



    return Response.json({success : true , message : "In process", vijay : "SUCCESS"});
}


async function liveVideoInterval(videoPath : String, videoInterval : any) {
    console.log("video path ->", videoPath);
    console.log("video interval ->", videoInterval);
    return true;
}

