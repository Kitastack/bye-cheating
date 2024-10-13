import database from "@config/prisma.db";
import { v4 } from "uuid";
import { Stream } from "@prisma/client";
import { errorHandler } from "@utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import StreamCreationValidation from "@src/validations/stream-creation.validation";

export default class StreamController {
  static readonly tableName: string = "Stream";
  static async getStream(streamId: string): Promise<Stream | null> {
    try {
      const find_stream = await database.stream.findFirst({
        where: {
          id: {
            equals: streamId,
          },
        },
      });
      if (!find_stream) throw new Error();
      return find_stream;
    } catch (error) {
      return null;
    }
  }
  static async createStream(payload: Stream): Promise<Stream | null> {
    try {
      if (!payload.url || !payload.userId) throw new Error();
      const id = payload?.id ?? v4();
      const [_, created_stream] = await database.$transaction([
        database.stream.upsert({
          where: { id },
          create: {
            id,
            url: payload.url,
            User: {
              connect: {
                id: payload.userId,
              },
            },
            createdDate: new Date(),
          },
          update: {
            updatedDate: new Date(),
          },
        }),
        database.stream.findFirst({
          where: {
            id: {
              equals: id,
            },
          },
        }),
      ]);
      return created_stream;
    } catch (error) {
      return null;
    }
  }
  static async create(req: Request, res: Response): Promise<Response | void> {
    try {
      const validatedBody = await StreamCreationValidation(req);

      try {
        if (Object.values(validatedBody.validate).length > 0) throw new Error();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Please check the form again",
          result: validatedBody.validate,
        });
      }

      if (!validatedBody.payload?._id) {
        validatedBody.payload._id = v4();
      }

      res.status(201).json({
        success: true,
        result: await StreamController.createStream({
          ...validatedBody.payload,
          userId: req.user.id,
        } as Stream),
        message: "successfully create stream",
      });
    } catch (error: any) {
      errorHandler(StreamController.tableName, error, req, res);
    }
  }
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const stream_id = req.params.id;
      const result = await database.stream.findFirst({
        where: {
          id: stream_id,
        },
      });

      res.status(200).json({
        success: true,
        message: null,
        result,
      });
    } catch (error: any) {
      errorHandler(StreamController.tableName, error, req, res);
    }
  }
  static async getAllByUser(
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

      const results = await database.stream.findMany({
        where: {
          ...(query ?? ({} as any)),
          userId: req.user.id,
        },
        orderBy: order ?? {},
      });

      res.status(200).json({
        success: true,
        message: null,
        result: results,
      });
    } catch (error: any) {
      errorHandler(StreamController.tableName, error, req, res);
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

      const results = await database.stream.findMany({
        where: {
          ...(query ?? ({} as any)),
        },
        orderBy: order ?? {},
      });

      res.status(200).json({
        success: true,
        message: null,
        result: results,
      });
    } catch (error: any) {
      errorHandler(StreamController.tableName, error, req, res);
    }
  }
}
