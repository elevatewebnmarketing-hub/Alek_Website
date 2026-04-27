import { createHash } from "node:crypto";

/** Response fields for client-side signed direct upload (api_secret never leaves the server). */
export type UploadSignaturePayload = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
};

/**
 * Cloudinary signed upload: hash ONLY the body fields you send (except file, api_key).
 * Sorted alphabetically: folder, then timestamp. resource_type is in the URL path only.
 * @see https://cloudinary.com/documentation/authentication_signatures
 */
export function getUploadSignature(folder: string): UploadSignaturePayload {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramStr = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(paramStr + apiSecret).digest("hex");

  return { signature, timestamp, cloudName, apiKey, folder };
}
