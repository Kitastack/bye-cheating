import { Role, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import database from "@config/prisma.db";

export const roles: Array<string> = [Role.admin];

const amongIncludes = (
  user_roles?: Array<string>,
  target?: Array<string> | string
) => {
  if (!target) return true;
  if (Array.isArray(target))
    return target?.some((_el) => user_roles?.includes(_el));
  return user_roles?.some((_el) => _el == target);
};

export const validateTokenHTTP =
  (roles_required?: Array<string>) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      req.user = (await validateToken(
        req.headers.authorization?.split(" ")[1],
        roles_required
      )) as any;

      if (req.user) {
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

export const validateToken = async (
  token?: string,
  roles_required?: Array<string>
): Promise<jwt.JwtPayload | null> => {
  try {
    if (!token) throw new Error("Please sign-in first");
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (
      !payload ||
      (payload?.id &&
        !(
          (await database.authentication.count({
            where: {
              id: payload?.id,
            },
          })) > 0
        ))
    )
      throw new Error("invalid");
    if (
      Array.isArray(roles_required) &&
      roles_required?.length > 0 &&
      !amongIncludes(payload?.roles as Array<any>, roles_required)
    )
      return null;
    return payload;
  } catch (error: any) {
    if (error?.message?.includes("invalid")) {
      throw new Error("Your session is invalid");
    } else if (error?.message?.includes("expired")) {
      throw new Error("Your session is expired");
    }
    throw error;
  }
};
