import {
  generateAccessToken,
  generateRefreshToken,
} from "@src/utils/tokenHandler";
import { validatePassword } from "@src/utils/hashHandler";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "@utils/errorHandler";
import { Prisma, User } from "@prisma/client";
import database from "@config/prisma.db";
import UserSignInValidation from "@validations/user-signin.validation";

export default class UserController {
  static readonly tableName: string = "User";
  static async signout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "You already logout",
        });
      }

      await database.authentication.delete({
        where: {
          id: req.user.id,
        },
      });

      return res.status(201).json({
        success: false,
        message: null,
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
  static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      let user: User = null;
      const validatedBody = await UserSignInValidation(req);
      try {
        if (Object.values(validatedBody.validate).length > 0) throw new Error();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Please check the form again",
          result: validatedBody.validate,
        });
      }

      console.log(validatedBody);

      // todo: check user
      try {
        user = (await database.user.findFirst({
          where: {
            OR: [
              {
                email: {
                  equals: validatedBody.payload?.email ?? "",
                },
              },
              //   {
              //     username: validatedBody.payload?.username ?? undefined,
              //   },
            ],
          },
          select: {
            password: false,
          },
        })) as User;

        if (!user?.id) {
          throw new Error();
        }
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: `User ${
            validatedBody.payload.username ?? validatedBody.payload?.email
          } not found`,
        });
      }

      // todo: validate password
      try {
        await validatePassword(user.password, validatedBody.payload.password);
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error?.message,
        });
      }

      res.status(201).json({
        success: true,
        result: {
          ...user,
          key: {
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user.id),
          },
        },
        message: "Successfully create user",
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
}
