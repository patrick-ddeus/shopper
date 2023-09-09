import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../protocols";
import httpStatus from "http-status";

export async function errorMiddleware(
  error: Error | ApplicationError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.name === "NotFoundError") {
    return res.status(httpStatus.NOT_FOUND).json({ message: error.message });
  }

  if (error.name === "NoContent") {
    return res.status(httpStatus.NO_CONTENT).json({ message: error.message });
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
}
