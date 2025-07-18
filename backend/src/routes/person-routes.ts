import Router from "express";
import { PersonController } from "../controllers/person-controller";
import { validateBody } from "../middlewares/validation-middleware";
import {
  createPersonSchema,
  updatePersonSchema,
} from "../validators/person.validator";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("PERSONS", "VIEW"),
  PersonController.getAllPersons
);

router.get(
  "/performers",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  PersonController.getOrderPerformersByRole
);

router.get(
  "/customers",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  PersonController.getCustomers
);

router.get(
  "/:id",
  verifyToken,
  checkPermission("PERSONS", "VIEW"),
  PersonController.getPersonById
);

router.post(
  "/",
  verifyToken,
  checkPermission("PERSONS", "CREATE"),
  validateBody(createPersonSchema),
  PersonController.createPerson
);

router.patch(
  "/:id",
  verifyToken,
  checkPermission("PERSONS", "UPDATE"),
  validateBody(updatePersonSchema),
  PersonController.updatePerson
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("PERSONS", "DELETE"),
  PersonController.deletePerson
);

export default router;
