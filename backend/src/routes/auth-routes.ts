import { RequestHandler, Router } from "express";
import { AuthController } from "../controllers/auth-controller";

import { validateBody } from "../middlewares/validation-middleware";
import { verifyToken } from "../middlewares/auth-middleware";

import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout as RequestHandler);

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

router.post(
  "/change-password",
  verifyToken,
  validateBody(changePasswordSchema),
  AuthController.changePassword
);

export default router;
