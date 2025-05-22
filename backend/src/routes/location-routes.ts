import { Router } from "express";

import { LocationController } from "../controllers/location-controller";

import { verifyToken } from "../middlewares/auth-middleware";
import { validateBody } from "../middlewares/validation-middleware";

import {
  createCitySchema,
  createCountrySchema,
} from "../validators/location.validator";

const router = Router();

router.get("/countries", verifyToken, LocationController.getCountries);
router.get(
  "/countries/:countryId/cities",
  verifyToken,
  LocationController.getCitiesByCountry
);
router.get("/cities", verifyToken, LocationController.getCities);
router.post(
  "/countries",
  verifyToken,
  validateBody(createCountrySchema),
  LocationController.createCountry
);
router.post(
  "/cities",
  verifyToken,
  validateBody(createCitySchema),
  LocationController.createCity
);
router.get("/countries/:id", verifyToken, LocationController.getCountyById);
router.get("/cities/:id", verifyToken, LocationController.getCityById);

export default router;
