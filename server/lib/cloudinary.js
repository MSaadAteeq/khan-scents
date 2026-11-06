import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function ensureConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** Upload a product image buffer; returns HTTPS URL (file stored on Cloudinary only). */
export async function uploadProductImage(buffer) {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "khan-scents/products",
        resource_type: "image",
        transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto:good" }],
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Image upload failed"));
          return;
        }
        resolve({ url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}
