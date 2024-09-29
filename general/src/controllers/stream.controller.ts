import database from "@config/prisma.db";
import { v4 } from "uuid";
import { Stream } from "@prisma/client";

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
  static async createStream(
    url: string,
    userId: string
  ): Promise<Stream | null> {
    try {
      if (!url || !userId) throw new Error();
      const id = v4();
      const [_, created_stream] = await database.$transaction([
        database.stream.create({
          data: {
            id,
            url,
            User: {
              connect: {
                id: userId,
              },
            },
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
}
