import Router from "express";
import { PersonController } from "../controllers/person-controller";
import { validateBody } from "../middlewares/validation-middleware";
import {
  createPersonSchema,
  updatePersonSchema,
} from "../validators/person.validator";

const router = Router();

router.get("/", PersonController.getAllPersons);

router.get("/:id", PersonController.getPersonById);

router.post(
  "/",
  validateBody(createPersonSchema),
  PersonController.createPerson
);

router.patch(
  "/:id",
  validateBody(updatePersonSchema),
  PersonController.updatePerson
);

router.delete("/:id", PersonController.deletePerson);

export default router;
