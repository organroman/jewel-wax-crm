import Router from "express";
import { UserController } from "../controllers/user-controller";

const router = Router();

router.get("/", UserController.getAllUsers);

// router.get("/:id");

router.post("/", UserController.createUser);

// router.put("/:id");

// router.delete("/:id");

export default router;
