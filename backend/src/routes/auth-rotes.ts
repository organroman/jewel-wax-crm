import Router from "express";
import { AuthController } from "../controllers/auth-controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/reset-password-token", AuthController.resetPasswordToken);
router.post("/reset-password", AuthController.resetPassword);

export default router;
