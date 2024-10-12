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
      if (
        !req.user ||
        !(await database.authentication.findFirst({
          where: {
            id: req.user.id,
          },
        }))
      ) {
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
        success: true,
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
      let user: User | null = null;
      const validatedBody = await UserSignInValidation(req);
      try {
        if (Object.values(validatedBody.validate).length > 0)
          throw new Error("Please check the form again");

        if (!validatedBody.payload?.email && !validatedBody.payload?.username)
          throw new Error("Either email or username must provided");
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error?.message,
          result: validatedBody.validate,
        });
      }

      console.log(validatedBody.payload);

      // todo: check user
      try {
        user = (await database.user.findFirst({
          where: {
            OR: [
              {
                email: validatedBody.payload?.email ?? undefined,
              },
              {
                username: validatedBody.payload?.username ?? undefined,
              },
            ],
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
      } finally {
        delete user.password;
      }

      res.status(201).json({
        success: true,
        result: {
          ...user,
          key: {
            accessToken: await generateAccessToken(user),
            refreshToken: await generateRefreshToken(user),
          },
        },
        message: "Successfully create user",
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
}
