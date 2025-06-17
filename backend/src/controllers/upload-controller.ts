import { NextFunction, Request, Response } from "express";
import cloudinary from "../cloudinary/config";

export const UploadController = {
  async uploadImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = req.user?.id;

      if (!files || files.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      const uploadResults = await Promise.all(
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

      const response = uploadResults.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        name: result.name,
        uploaded_by: Number(userId),
      }));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
