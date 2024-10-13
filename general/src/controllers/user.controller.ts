import {
  generateAccessToken,
  generateRefreshToken,
} from "@src/utils/tokenHandler";
import UserCreationValidation from "@validations/user-creation.validation";
import { generatePassword } from "@src/utils/hashHandler";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "@utils/errorHandler";
import { create_user } from "@prisma/client/sql";
import database from "@config/prisma.db";
import { v4 } from "uuid";

export default class UserController {
  static readonly tableName: string = "User";
  static async getMyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const result = await database.user.findFirst({
        where: {
          id: req.user.id,
        },
      });

      delete result.password;
      res.status(201).json({
        success: true,
        message: null,
        result,
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user_id = req.params.id;
      const result = await database.user.findFirst({
        where: {
          id: user_id,
        },
      });

      delete result.password;
      res.status(200).json({
        success: true,
        message: null,
        result,
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const query = await new Promise((resolve) => {
        try {
          resolve(JSON.parse(req.query?.query as string));
        } catch (error) {
          resolve(null);
        }
      });

      const order = await new Promise((resolve) => {
        try {
          resolve(JSON.parse(req.query?.order as string));
        } catch (error) {
          resolve(null);
        }
      });

      const is_show_authentication = Boolean(req.query.Authentication ?? false);
      const is_show_report = Boolean(req.query.Report ?? false);
      const is_show_stream = Boolean(req.query.Stream ?? false);

      const results = await database.user.findMany({
        where: {
          ...(query ?? ({} as any)),
          id: req.user.id,
        },
        orderBy: order ?? {},
        include: {
          Authentication: is_show_authentication,
          Report: is_show_report,
          Stream: is_show_stream,
        },
      });

      res.status(200).json({
        success: true,
        message: null,
        result: results?.map((result) => {
          delete result.password;
          return result;
        }),
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const validatedBody = await UserCreationValidation(req);
      try {
        if (Object.values(validatedBody.validate).length > 0) throw new Error();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "please check the form again",
          result: validatedBody.validate,
        });
      }

      if (!validatedBody.payload?._id) {
        validatedBody.payload._id = v4();
      }

      // todo: check email
      try {
        const is_user_exist = await database.user.findFirst({
          where: {
            email: {
              equals: validatedBody.payload?.email,
            },
          },
        });
        if (is_user_exist?.id)
          throw new Error(
            `user with email ${validatedBody.payload?.email} already registered`
          );
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error?.message,
        });
      }

      // todo: generate password
      try {
        validatedBody.payload.password = await generatePassword(
          validatedBody.payload.password
        );
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error?.message,
        });
      }

      const [_, created_user] = await database.$transaction([
        database.$queryRawTyped(
          create_user(
            validatedBody.payload._id,
            validatedBody.payload.email,
            validatedBody.payload.username,
            validatedBody.payload.password
          )
        ),
        database.user.findFirst({
          where: {
            id: {
              equals: validatedBody.payload._id,
            },
          },
        }),
      ]);

      delete created_user.password;
      res.status(201).json({
        success: true,
        result: {
          ...created_user,
          key: {
            accessToken: await generateAccessToken(created_user),
            refreshToken: await generateRefreshToken(created_user.id),
          },
        },
        message: "successfully create user",
      });
    } catch (error: any) {
      errorHandler(UserController.tableName, error, req, res);
    }
  }
}
