import {ImageDao} from "../ImageDao";
import { S3Client, PutObjectCommand, ObjectCannedACL} from "@aws-sdk/client-s3";

export class DynamoButReallyS3Dao implements ImageDao {
    private readonly BUCKET_NAME = "tweeter-fall-2024-cs340"
    private readonly REGION = 'us-west-1'

    async putImage(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string> {
        console.log("ENTER PUT IMAGE")
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );
        const s3Params = {
            Bucket: this.BUCKET_NAME,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: ObjectCannedACL.public_read
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: this.REGION });
        try {
            console.log("ABOUT TO SEND")
            await client.send(c);
            console.log("PICTURE HAS SENT")
            return (
                `https://${this.BUCKET_NAME}.s3.${this.REGION}.amazonaws.com/image/${fileName}`
            );
        } catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}
