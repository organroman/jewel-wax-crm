import { Router } from "express";

import { ContactController } from "../controllers/contact-controller";

import {
  createContactSchema,
  updateContactSchema,
} from "../validators/contact.validator";

import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { validateBody } from "../middlewares/validation-middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("CONTACTS", "VIEW"),
  ContactController.getAllContacts
);

router.get(
  "/:id",
  verifyToken,
  checkPermission("CONTACTS", "VIEW"),
  ContactController.getById
);

router.post(
  "/",
  verifyToken,
  checkPermission("CONTACTS", "CREATE"),
  validateBody(createContactSchema),
  ContactController.create
);

router.patch(
  "/:id",
  verifyToken,
  checkPermission("CONTACTS", "UPDATE"),
  validateBody(updateContactSchema),
  ContactController.update
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("CONTACTS", "DELETE"),
  ContactController.delete
);

export default router;
