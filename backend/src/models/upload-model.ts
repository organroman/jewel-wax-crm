import { UploadedFileMeta } from "../types/upload.types";
import path from "path";

import { s3 } from "../digital-ocean/spaces-client";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../cloudinary/config";

export const UploadModel = {
  async uploadImages(
    files: Express.Multer.File[]
  ): Promise<UploadApiResponse[]> {
    return await Promise.all(
      files.map((file) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        return cloudinary.uploader
          .upload(base64, {
            folder: "uploads",
          })
          .then((result) => ({
            ...result,
            name: file.originalname,
          }));
      })
    );
  },
  async uploadFiles(
    files: Express.Multer.File[],
    folder = "documents"
  ): Promise<UploadedFileMeta[]> {
    const results: UploadedFileMeta[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname);
      const uniqueKey = `${folder}/${file.originalname}${ext}`;

      const upload = await s3
        .upload({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: uniqueKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        })
        .promise();

      results.push({
        key: uniqueKey,
        url: upload.Location,
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      });
    }

    return results;
  },
};
