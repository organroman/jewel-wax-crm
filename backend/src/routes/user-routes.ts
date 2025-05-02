import Router from "express";
import { UserController } from "../controllers/user-controller";
import { validateBody } from "../middlewares/validation-middleware";
import { createUserSchema } from "../validators/user.validator";

const router = Router();

router.get("/", UserController.getAllUsers);

// router.get("/:id");

router.post("/", validateBody(createUserSchema), UserController.createUser);

// router.put("/:id");

// router.delete("/:id");

export default router;
