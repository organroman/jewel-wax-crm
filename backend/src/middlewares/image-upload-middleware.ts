import multer from "multer";

const storage = multer.memoryStorage();
export const uploadImages = multer({ storage });
