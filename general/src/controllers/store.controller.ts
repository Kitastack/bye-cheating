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

      const predictions = report_predictions?.map(
        (item, idx) =>
          ({
            id: v4(),
            data: item,
            createdDate: new Date(),
          } as ReportItems)
      );

      if (is_frame_stored) {
        var videoStream = new stream.PassThrough();
        var imagesStream = new stream.PassThrough();

        report_frame.forEach((item) => {
          imagesStream.write(
            Buffer.from(item, "base64")
            // Buffer.from(`data:image/jpeg;base64,${item.frameUrl}`, "base64")
          );
        });
        imagesStream.end();

        ffmpeg()
          .input(imagesStream)
          .inputFormat("image2pipe")
          .inputOptions("-framerate 12")
          .inputOptions("-pix_fmt rgb24")
          .format("mp4")
          .videoCodec("libx264")
          .outputOptions("-movflags frag_keyframe+empty_moov")
          //   .videoCodec("libpvsx")
          //   .output(join(__dirname, "frames.mp4"))
          //   .on("start", function (commandLine) {
          //     console.log(commandLine);
          //   })
          //   .on("codecData", (data) => {
          //     console.log("CODEC DATA:");
          //     console.log(data);
          //   })
          //   .on("progress", (progress) => {
          //     console.log("PROGRESS:");
          //     console.log(progress);
          //   })
          //   .on("stderr", (stderr) => {
          //     console.log(stderr);
          //   })
          //   .on("error", (err) => {
          //     console.log("Error rendering: %s", err.message);
          //   })
          //   .on("end", () => {
          //     console.log("Video saved!");
          //   })
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

          console.log("video saved to pipeline");

          await axios.post(`http://192.168.137.1:8000/upload/test`, formData, {
            params: {
              token: "h8ts8futpdtp7n2l1l2jdjfe3zorwi",
            },
            headers: {
              "Content-Type": "multipart",
            },
          });

          console.log("video uploaded");
        });
        // then finally end the stream
        // ffmpeg()
        //   .input(
        //     [
        //       "-f rawvideo -video_size 1920x1080 -pixel_format rgb24 -framerate 30/1 -i",
        //       predictions[0].frameUrl,
        //       predictions[1].frameUrl,
        //       predictions[2].frameUrl,
        //       predictions[3].frameUrl,
        //       predictions[4].frameUrl,
        //     ].join(" ")
        //   )
        //   .output(join(__dirname, "video.mp4"))
        //   .run();
        // formData.append(
        //   "file",
        //   new Blob([Buffer.from(report_frame[0], "base64")], {
        //     type: last_data_report.contentType ?? "image/jpeg",
        //   })
        // );
        // writeFile(
        //   join(__dirname, "testsaja.mp4"),
        //   stream.read,
        // //   Buffer.from(
        // //     await new Blob([Buffer.from(report_frame[0], "base64")], {
        // //       type: last_data_report.contentType ?? "image/jpeg",
        // //     }).arrayBuffer()
        // //   ),
        //   (err) => {
        //     console.log("err", err);
        //   }
        // );
      }

      //   await database.$transaction([
      //     database.reportItems.createMany({
      //       data: report_predictions.map((prediction) => ({
      //         data: prediction,
      //         frameUrl
      //       }))
      //     }),
      //   ]);

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
