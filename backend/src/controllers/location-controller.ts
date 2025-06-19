import { Request, Response, NextFunction } from "express";
import { LocationService } from "../services/location-service";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const LocationController = {
  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const countries = await LocationService.getAllCountries();
      res.status(200).json(countries);
    } catch (error) {
      next(error);
    }
  },
  async getCountyById(req: Request, res: Response, next: NextFunction) {
    try {
      const country = await LocationService.getCountryById(
        Number(req.params.id)
      );
      if (!country) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(country);
    } catch (error) {
      next(error);
    }
  },
  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;

      const cities = await LocationService.getPaginatedCities(search as string);

      res.status(200).json(cities);
    } catch (error) {
      next(error);
    }
  },
  async getCitiesByCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;

      const cities = await LocationService.getCitiesByCountry(
        Number(req.params.countryId),
        search as string
      );
      res.status(200).json(cities);
    } catch (error) {
      next(error);
    }
  },
  async getCityById(req: Request, res: Response, next: NextFunction) {
    try {
      const city = await LocationService.getCityById(Number(req.params.id));
      if (!city) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(city);
    } catch (error) {
      next(error);
    }
  },

  async createCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const newCountry = await LocationService.createCountry(
        req.body,
        currentUser
      );
      res.status(201).json(newCountry);
    } catch (error) {
      next(error);
    }
  },
  async createCity(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const newCity = await LocationService.createCity(req.body, currentUser);
      res.status(201).json(newCity);
    } catch (error) {
      next(error);
    }
  },
};
