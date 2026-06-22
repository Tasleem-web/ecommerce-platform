import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always return https URLs
});

/**
 * Uploads an image buffer directly to Cloudinary using a stream.
 * @param fileBuffer - The memory buffer of the image file.
 * @param folder - Optional folder destination in Cloudinary.
 */
export const uploadImageBuffer = (
  fileBuffer: Buffer,
  folder: string = 'uploads'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Upload failed with empty result.'));
        }
        resolve(result);
      }
    );

    // Write the buffer to the stream and end it
    uploadStream.end(fileBuffer);
  });
};

/**
 * Alternative: Uploads a local file path or base64 string directly
 * @param filePath - Path to local file, remote URL, or base64 data URI
 */
export const uploadLocalFile = async (filePath: string, folder: string = 'local_uploads'): Promise<UploadApiResponse> => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
