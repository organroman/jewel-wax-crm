import { Router } from "express";

import { UploadController } from "../controllers/upload-controller";

import { uploadImages } from "../middlewares/image-upload-middleware";
import { verifyToken } from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/media",
  verifyToken,
  uploadImages.array("images", 10),
  UploadController.uploadMedia
);

export default router;
