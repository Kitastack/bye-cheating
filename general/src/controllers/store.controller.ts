import { Report, ReportItems, Stream } from "@prisma/client";
import { error, info } from "@src/utils/logger";
import { v4 } from "uuid";
import database from "@config/prisma.db";
import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import Formdata from "form-data";
import stream from "node:stream";
import type { RedisClientType } from "redis";

export default class StoreController {
  static async updateReport(
    redis: RedisClientType,
    report_data: Report,
    report_predictions: string[],
    report_frame?: string[]
  ): Promise<boolean> {
    try {
      const stream_data = (report_data as any)?.stream as Stream;
      const last_stream_report = await database.stream.upsert({
        where: {
          id: stream_data.id,
        },
        create: {
          id: stream_data.id,
          url: stream_data.url,
          createdDate: stream_data.createdDate,
          userId: stream_data.userId,
        },
        update: {
          updatedDate: new Date(),
        },
      });
      const last_data_report = await database.report.upsert({
        where: {
          id: report_data.id,
        },
        create: {
          id: report_data.id,
          title: report_data.title,
          createdDate: report_data.createdDate,
          description: report_data.description,
          time: report_data.time,
          contentType: report_data.contentType,
          isFrameStored: report_data.isFrameStored,
          streamId: last_stream_report.id,
          userId: report_data.userId,
        },
        update: {
          updatedDate: new Date(),
        },
      });

      const is_frame_stored =
        last_data_report.isFrameStored && report_frame?.length > 0;

      if (is_frame_stored) {
        let videoStream = new stream.PassThrough();
        let imagesStream = new stream.PassThrough();
        report_frame.forEach((item) =>
          imagesStream.write(Buffer.from(item, "base64"))
        );
        imagesStream.end();

        ffmpeg()
          .input(imagesStream)
          .inputFormat("image2pipe")
          .inputOptions("-framerate 12")
          .inputOptions("-pix_fmt rgb24")
          .format("mp4")
          .videoCodec("libx264")
          .outputOptions("-movflags frag_keyframe+empty_moov")
          .writeToStream(videoStream);

        const videoResult: Buffer = await new Promise(function (
          resolve,
          reject
        ) {
          const buffers: any[] = [];
          videoStream.on("data", (buffer) => {
            buffers.push(buffer);
          });
          videoStream.on("end", () => {
            resolve(Buffer.concat(buffers));
          });
          videoStream.on("error", (err) => {
            reject(err);
          });
        });

        info("update-report", "video saved to pipeline");

        const form_video = new Formdata();
        form_video.append("file", videoResult, {
          contentType: "video/mpeg",
          filename: `${report_data.id}.mp4`,
        });

        const response_video = await axios.post(
          `${process.env.STORAGE_URL}/upload/${process.env.STORAGE_BUCKET}`,
          form_video,
          {
            params: {
              token: process.env.STORAGE_TOKEN,
              //   id: report_data.id,
            },
            headers: {
              "Content-Type": "multipart",
            },
          }
        );

        info("update-report", "video uploaded");

        await database.report.update({
          where: {
            id: report_data.id,
          },
          data: {
            recordUrl: `${process.env.STORAGE_URL}${response_video.data.url}`,
            updatedDate: new Date(),
          },
        });

        const form_thumbnail = new Formdata();
        form_thumbnail.append("file", Buffer.from(report_frame[0], "base64"), {
          contentType: "image/jpeg",
          filename: `${report_data.id}.jpeg`,
        });

        const response_thumbnail = await axios.post(
          `${process.env.STORAGE_URL}/upload/${process.env.STORAGE_BUCKET}`,
          form_thumbnail,
          {
            params: {
              token: process.env.STORAGE_TOKEN,
            },
            headers: {
              "Content-Type": "multipart",
            },
          }
        );

        info("update-report", "thumbnail created and uploaded");

        await database.report.updateMany({
          where: {
            id: report_data.id,
          },
          data: {
            thumbnailUrl: `${process.env.STORAGE_URL}${response_thumbnail.data.url}`,
            updatedDate: new Date(),
          },
        });
      }

      await database.$transaction([
        database.reportItems.createMany({
          data: report_predictions?.map(
            (item) =>
              ({
                id: v4(),
                data: item,
                reportId: last_data_report.id,
                createdDate: new Date(),
              } as ReportItems)
          ),
        }),
      ]);

      return true;
    } catch (error) {
      return false;
    }
  }
}
