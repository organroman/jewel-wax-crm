import { Router } from "express";

import { UploadController } from "../controllers/upload-controller";

import { uploadImages } from "../middlewares/image-upload-middleware";
import { verifyToken } from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/images",
  verifyToken,
  uploadImages.array("images", 10),
  UploadController.uploadImages
);

export default router;
