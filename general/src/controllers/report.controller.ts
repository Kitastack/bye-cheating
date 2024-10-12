import database from "@config/prisma.db";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { Report } from "@prisma/client";
import { errorHandler } from "@src/utils/errorHandler";

export default class ReportController {
  static readonly tableName: string = "Report";
  static async createReport(
    userId: string,
    streamId: string,
    title: string,
    description: string,
    isFrameStored: boolean = false
  ): Promise<Report | null> {
    try {
      if (!userId || !streamId) throw new Error();
      const id = v4();
      const [_, created_stream] = await database.$transaction([
        database.report.create({
          data: {
            id,
            title,
            description,
            isFrameStored,
            Stream: {
              connect: {
                id: streamId,
              },
            },
            User: {
              connect: {
                id: userId,
              },
            },
          },
        }),
        database.report.findFirst({
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
  static async getReportById(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const report_id = req.params.id;

      const result = await database.report.findFirst({
        where: {
          id: report_id,
        },
        include: {
          ReportItems: true,
          Stream: true,
        },
      });

      res.status(200).json({
        success: true,
        message: null,
        result: {
          ...result,
          ReportItems: result.ReportItems.map((item) => ({
            ...item,
            data: JSON.parse(item.data.toString()),
          })),
        },
      });
    } catch (error: any) {
      errorHandler(ReportController.tableName, error, req, res);
    }
  }
  static async getReport(
    req: Request,
    res: Response
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

      const is_show_report_items = Boolean(req.query.ReportItems ?? false);
      const is_show_stream = Boolean(req.query.Stream ?? false);

      const results = await database.report.findMany({
        where: {
          ...(query ?? ({} as any)),
          userId: req.user.id,
        },
        orderBy: order ?? {},
        include: {
          ReportItems: is_show_report_items,
          Stream: is_show_stream,
        },
      });

      res.status(200).json({
        success: true,
        message: null,
        result: results?.map((result) => ({
          ...result,
          ReportItems: result.ReportItems?.map((item) => ({
            ...item,
            data: JSON.parse(item.data.toString()),
          })),
        })),
      });
    } catch (error: any) {
      errorHandler(ReportController.tableName, error, req, res);
    }
  }
}
