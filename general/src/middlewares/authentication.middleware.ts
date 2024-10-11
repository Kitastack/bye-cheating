import { Role, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const roles: Array<string> = [Role.admin, Role.superadmin];

const amongIncludes = (target?: Array<string> | string) => {
  if (!target) return true;
  if (Array.isArray(target)) return target?.some((_el) => roles?.includes(_el));
  return roles?.some((_el) => _el == target);
};

export const validateTokenHTTP =
  (roles?: Array<string>) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      req.user = validateToken(
        req.headers.authorization?.split(" ")[1],
        roles
      ) as any;

      if (Array.isArray(roles) && req.user) {
        return next();
      }

      res.status(400).json({
        success: false,
        message: "You have no right access",
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error?.message,
      });
    }
  };

export const validateToken = (
  token?: string,
  roles?: Array<string>
): jwt.JwtPayload | null => {
  try {
    console.log(token);
    if (!token) throw new Error("Please sign-in first");
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!payload) throw new Error("invalid");
    if (Array.isArray(roles) && !amongIncludes(roles)) return null;
    return payload as any;
  } catch (error: any) {
    if (error?.message?.includes("invalid")) {
      throw new Error("Your token is invalid");
    } else if (error?.message?.includes("expired")) {
      throw new Error("Your token is expired");
    }
    throw error;
  }
};
