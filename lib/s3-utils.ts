import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadToS3(file: File, folder: string = "shops"): Promise<string> {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${folder}/${nanoid()}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer(); // Get the ArrayBuffer
    const uint8Array = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: uint8Array, // Use the Uint8Array here
        ContentType: file.type,
    });

    await s3Client.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
