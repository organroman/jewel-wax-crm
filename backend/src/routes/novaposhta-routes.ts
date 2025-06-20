import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { NovaPoshtaController } from "../controllers/novaposhta-controller";

const router = Router();

router.get("/cities", verifyToken, NovaPoshtaController.getCities);
router.get("/warehouses", verifyToken, NovaPoshtaController.getWarehouses);
router.get(
  "/cities/:cityRef/streets",
  verifyToken,
  NovaPoshtaController.getCityStreets
);

export default router;
