import { Response } from "express";

export const setRefreshCookie = (
  res: Response,
  token: string,
  maxAgeMs = 30 * 24 * 60 * 60 * 1000
) => {
  res.cookie("rt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeMs,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie("rt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};
