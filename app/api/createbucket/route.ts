// app/api/createbucket/route.ts
import { NextRequest, NextResponse } from "next/server";
const Minio = require('minio')

const minioClient = new Minio.Client({
    endPoint: "127.0.0.1",
    port: 9000,
    useSSL: false,
    accessKey: "admin",
    secretKey: "admin1234",
  });


export async function POST(req: NextRequest) {
  try {
    const { bucketName } = await req.json();

    if (!bucketName) {
      return NextResponse.json(
        { error: "Bucket name is required" },
        { status: 400 }
      );
    }

    console.log(`Attempting to create bucket: ${bucketName}`);

    await minioClient.makeBucket(bucketName, "us-east-1");

    console.log(`Bucket ${bucketName} created successfully`);

    return NextResponse.json({ message: "Bucket created successfully" });
  } catch (error) {
    console.log("Error bucket created", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
