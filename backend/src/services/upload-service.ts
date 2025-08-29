import { UploadedMedia } from "../types/upload.types";
import { UploadModel } from "../models/upload-model";

export const UploadService = {
  async upload(
    files: Express.Multer.File[],
    userId: number
  ): Promise<UploadedMedia[]> {
    const imageAndVideoFiles = files.filter(
      (file) =>
        file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")
    );

    const otherFiles = files.filter(
      (file) =>
        !file.mimetype.startsWith("image/") &&
        !file.mimetype.startsWith("video/")
    );
    const cloudinaryResult = await UploadModel.uploadImages(imageAndVideoFiles);
    const images = cloudinaryResult.map((item) => ({
      url: item.secure_url,
      public_id: item.public_id,
      format: item.resource_type,
      width: item.width,
      height: item.height,
      size: item.bytes,
      name: item.name,
      uploaded_by: userId ?? null,
    }));

    const fileResults = await UploadModel.uploadFiles(otherFiles);
    const filesMeta = fileResults.map((item) => ({
      url: item.url,
      public_id: item.key,
      name: item.name,
      size: item.size,
      format: item.mimeType,
      uploaded_by: userId,
    }));

    return [...images, ...filesMeta];
  },
};
