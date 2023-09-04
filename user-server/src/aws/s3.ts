import sharp from "sharp";
import env from "../utils/validateEnv";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import createHttpError from "http-errors";

const config = {
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_KEY
}

const s3 = new S3Client(config);



// upload a file to s3
export async function uploadFile(file: Express.Multer.File, bucketName: string) {
    // resizing the image before uploading to s3
    const productImg = await sharp(file.path)
        .resize({ width: 160, height: 160, fit: 'inside' })
        .toBuffer();

    const uploadParams = {
        Bucket: bucketName,
        Body: productImg,
        Key: file.filename,
        BucketKeyEnabled: true
    }

    const command = new PutObjectCommand(uploadParams);
    try {
        const response = await s3.send(command);
        if (response.$metadata.httpStatusCode === 200) {
            return uploadParams.Key
        }
        throw createHttpError(500, 'Image did not upload');
    } catch (err) {
        throw createHttpError(500, 'Image did not upload');
    }
}


// deleting an image from s3
export async function deleteImage(filekey: string, bucketName: string) {
    const params = {
        Key: filekey,
        Bucket: bucketName
    }
    const command = new DeleteObjectCommand(params);
    const response = await s3.send(command);
    return response;
}
