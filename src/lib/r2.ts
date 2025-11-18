import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Url } from "./constants";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.KKRLL_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.KKRLL_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.KKRLL_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  content: string | Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.KKRLL_R2_BUCKET_NAME!,
    Key: key,
    Body: content,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const publicURL = getR2Url(key);
  return publicURL;
}
