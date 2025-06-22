import { Request, Response, NextFunction } from "express";
import { NovaPoshtaService } from "../services/novaposhta-service";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const NovaPoshtaController = {
  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const { search = "" } = req.query;
      const cities = await NovaPoshtaService.findCities(search as string);
      res.status(200).json(cities);
    } catch (error) {
      next(error);
    }
  },

  async getWarehouses(req: Request, res: Response, next: NextFunction) {
    try {
      const { cityRef, search } = req.query;
      if (!cityRef) {
        throw new AppError(ERROR_MESSAGES.MISSING_CITY_REF_PARAM, 401);
      }
      const warehouses = await NovaPoshtaService.getCityWarehouses(
        cityRef as string,
        search as string
      );
      res.status(200).json(warehouses);
    } catch (error) {
      next(error);
    }
  },

  async getCityStreets(req: Request, res: Response, next: NextFunction) {
    try {
      const { streetName } = req.query;
      const cityRef = req.params.cityRef;

      if (!cityRef) {
        throw new AppError(ERROR_MESSAGES.MISSING_CITY_REF_PARAM, 401);
      }

      const streets = await NovaPoshtaService.getCityStreets(
        cityRef as string,
        streetName as string
      );
      res.status(200).json(streets);
    } catch (error) {
      next(error);
    }
  },
  async getCargoTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const cargoTypes = await NovaPoshtaService.getCargoTypes();
      res.status(200).json(cargoTypes);
    } catch (error) {
      next(error);
    }
  },
};
