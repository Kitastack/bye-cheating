import database from "@config/prisma.db";
import { v4 } from "uuid";
import { Report, ReportItems, Stream } from "@prisma/client";
import ffmpeg from "fluent-ffmpeg";
import { Blob } from "node:buffer";
import { writeFile } from "node:fs";
import { join } from "node:path";
import axios from "axios";
import Formdata from "form-data";
import stream from "node:stream";
import { info } from "@src/utils/logger";

export default class StoreController {
  static readonly tableName: string = "Report";
  static async updateReport(
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

        const buffers: any[] = [];
        videoStream.on("data", (buffer) => {
          buffers.push(buffer);
        });

        videoStream.on("end", async () => {
          const formData = new Formdata();
          formData.append("file", Buffer.concat(buffers), {
            contentType: "video/mpeg",
            filename: `${report_data.id}.mp4`,
          });

          info("update-report", "video saved to pipeline");

          await axios.post(
            `${process.env.STORAGE_URL}/upload/${process.env.STORAGE_BUCKET}`,
            formData,
            {
              params: {
                token: process.env.STORAGE_TOKEN,
                id: report_data.id,
              },
              headers: {
                "Content-Type": "multipart",
              },
            }
          );

          info("update-report", "video uploaded");
        });
      }

      await database.$transaction([
        database.reportItems.createMany({
          data: report_predictions?.map(
            (item, idx) =>
              ({
                id: v4(),
                data: item,
                createdDate: new Date(),
              } as ReportItems)
          ),
        }),
      ]);

      //   if (last_data_report.isFrameStored) {
      //   }
      //   console.log(last_data_report, report_data);
      //   const find_stream = await database.stream.findFirst({
      //     where: {
      //       id: {
      //         equals: streamId,
      //       },
      //     },
      //   });
      //   if (!find_stream) throw new Error();
      //   return find_stream;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
