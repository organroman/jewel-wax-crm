import Router from "express";
import { AuthController } from "../controllers/auth-controller";

import { validateBody } from "../middlewares/validation-middleware";
import { verifyToken } from "../middlewares/auth-middleware";

import {
  emailSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout);
router.post(
  "/refresh-token",
  validateBody(refreshTokenSchema),
  AuthController.refreshToken
);
router.get("/me", verifyToken, AuthController.getMe);
router.post(
  "/reset-password-token",
  validateBody(emailSchema),
  AuthController.resetPasswordToken
);
router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  AuthController.resetPassword
);

export default router;
