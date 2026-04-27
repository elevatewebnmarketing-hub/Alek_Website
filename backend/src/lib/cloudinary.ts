import { createHmac } from "node:crypto";

export function getUploadSignature(folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramStr = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHmac("sha1", apiSecret).update(paramStr).digest("hex");

  return { signature, timestamp, cloudName, apiKey, folder };
}
