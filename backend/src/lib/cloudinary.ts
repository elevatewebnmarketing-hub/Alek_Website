import { createHash } from "node:crypto";

export function getUploadSignature(folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Parameters must be alphabetically sorted: folder < timestamp < type
  const paramStr = `folder=${folder}&timestamp=${timestamp}&type=upload`;
  const signature = createHash("sha1").update(paramStr + apiSecret).digest("hex");

  return { signature, timestamp, cloudName, apiKey, folder, type: "upload" };
}
