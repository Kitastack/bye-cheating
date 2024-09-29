import database from "@config/prisma.db";
import { v4 } from "uuid";
import { Report } from "@prisma/client";

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
}
