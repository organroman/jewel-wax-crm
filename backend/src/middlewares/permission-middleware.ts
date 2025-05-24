import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

import { PERMISSIONS } from "../constants/permissions";

import { Module, Action } from "../types/permission.types";
import { PersonRole } from "../types/person.types";

export const checkPermission = (module: Module, action: Action) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as PersonRole;

    if (!userRole) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    const allowedRoles = PERMISSIONS[module][action];

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError(ERROR_MESSAGES.ACCESS_DENIED, 403));
    }

    next();
  };
};
