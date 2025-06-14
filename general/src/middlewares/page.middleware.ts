import type { Request, Response, NextFunction } from "express";
import { CustomError } from "@src/libs/error.lib";
import { StatusCodes } from "http-status-codes";

export const errorHandler = async (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) next();
  logging.warning(error);
  if (error.status == StatusCodes.INTERNAL_SERVER_ERROR) {
    const logs = await database.logs.create({
      data: {
        type: "error",
        code: +(error?.status ?? StatusCodes.INTERNAL_SERVER_ERROR),
        message: error.message?.trim(),
      },
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `internal server error ${logs.id}`,
    });
  } else {
    res.status(error?.status ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.message?.trim(),
    });
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "route not found",
  });
};
