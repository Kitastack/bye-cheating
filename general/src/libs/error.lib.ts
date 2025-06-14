import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

class BadRequestError extends Error implements CustomError {
  status = StatusCodes.BAD_REQUEST;
  code = "BAD_REQUEST";
  constructor(message: string) {
    super(message);
  }
}

class NotFoundError extends Error implements CustomError {
  status = StatusCodes.NOT_FOUND;
  code = "NOT_FOUND";
  constructor(message: string) {
    super(message);
  }
}

class UnauthorizedError extends Error implements CustomError {
  status = StatusCodes.UNAUTHORIZED;
  code = "UNAUTHORIZED";
  constructor(message: string) {
    super(message);
  }
}

class ForbiddenError extends Error implements CustomError {
  status = StatusCodes.FORBIDDEN;
  code = "FORBIDDEN";
  constructor(message: string) {
    super(message);
  }
}

class InternalServerError extends Error implements CustomError {
  status = StatusCodes.INTERNAL_SERVER_ERROR;
  code = "INTERNAL_SERVER_ERROR";
  constructor(message: string) {
    super(message);
  }
}

export {
  CustomError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
};
