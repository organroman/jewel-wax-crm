import { NextFunction, Request, Response } from "express";

import { UploadService } from "../services/upload-service";
import ERROR_MESSAGES from "../constants/error-messages";

export const UploadController = {
  async uploadMedia(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = req.user?.id;

      if (!files || files.length === 0) {
        res.status(400).json({ message: ERROR_MESSAGES.NO_FILES });
        return;
      }

      const uploadResult = await UploadService.upload(files, Number(userId));

      res.status(200).json(uploadResult);
    } catch (error) {
      next(error);
    }
  },
};
