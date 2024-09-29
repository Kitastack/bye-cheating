import { NextFunction, Request, Response } from "express";
import { error as loggerError } from "@utils/logger";

export const errorHandler = (
  tableName: string,
  error: Error,
  req: Request,
  res: Response
) => {
  loggerError(tableName, error?.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
