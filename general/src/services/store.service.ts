import { Server, ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { StoreRequest, StoreResponse } from "@protoc/store_pb";
import { StoreServiceService } from "@protoc/store_grpc_pb";
import type { RedisClientType } from "redis";
import StoreController from "@controllers/store.controller";

export default class StoreService {
  grpcServer: Server;
  redis: RedisClientType;

  constructor(server: Server, redis: any) {
    this.grpcServer = server;
    this.redis = redis;
    this.addService();
  }

  async addService(): Promise<Response | void> {
    this.grpcServer.addService(StoreServiceService, {
      saveReport: this.storeReport.bind(this),
    });
  }

  async storeReport(
    call: ServerUnaryCall<StoreRequest, StoreResponse>,
    callback: sendUnaryData<StoreResponse>
  ): Promise<void> {
    try {
      const report_id = call.request.getReportId();
      const report_data = await this.redis.get(report_id);

      if (!report_data) {
        throw new Error("report data not found");
      }

      const success = await StoreController.updateReport(
        JSON.parse(report_data) as any,
        (await this.redis.lRange(`prediction#${report_id}`, 0, -1))?.reverse(),
        (await this.redis.lRange(`frame#${report_id}`, 0, -1))?.reverse()
      );

      const deleteUnusedData = async () => {
        if (!JSON.parse(await this.redis.get(report_id))?.is_done) {
          setTimeout(deleteUnusedData, 1 * 60 * 10000);
        } else {
          // delete all keys contain
          for await (const key_scanned of this.redis.scanIterator({
            MATCH: `*${report_id}`,
          })) {
            console.log(`deleting ${key_scanned}`);
            await this.redis.del(key_scanned);
          }
        }
      };

      deleteUnusedData();

      callback(
        null,
        new StoreResponse().setMessage("store data report").setSuccess(success)
      );
    } catch (error: any) {
      callback(
        null,
        new StoreResponse().setMessage(error?.message).setSuccess(false)
      );
    }
  }
  //   async getStream(
  //     call: ServerUnaryCall<StreamRequest, StreamResponse>,
  //     callback: sendUnaryData<StreamResponse>
  //   ): Promise<void> {
  //     try {
  //       // "rtsp://rtspstream:07451b4ef79b34a8473a745fd99a50e0@zephyr.rtsp.stream/movie"
  //       const streamId = call.request.getStreamid();
  //       // disabled temp
  //       // const userData = validateToken(call.metadata.get("token").toString());
  //       const getStream = await StreamController.getStream(streamId);
  //       callback(
  //         null,
  //         new StreamResponse()
  //           .setSuccess(true)
  //           .setResult(JSON.stringify(getStream))
  //       );
  //     } catch (error: any) {
  //       callback(
  //         null,
  //         new StreamResponse()
  //           .setMessage(error?.message)
  //           .setSuccess(false)
  //           .setResult(null)
  //       );
  //     }
  //   }

  //   async createStream(
  //     call: ServerUnaryCall<StreamCreateRequest, StreamResponse>,
  //     callback: sendUnaryData<StreamResponse>
  //   ): Promise<void> {
  //     try {
  //       const streamUrl = call.request.getUrl();
  //       const userData = validateToken(call.metadata.get("token").toString());
  //       const createdStream = await StreamController.createStream(
  //         streamUrl,
  //         userData.id
  //       );
  //       callback(
  //         null,
  //         new StreamResponse()
  //           .setMessage(null)
  //           .setSuccess(true)
  //           .setResult(JSON.stringify(createdStream))
  //       );
  //     } catch (error: any) {
  //       callback(
  //         null,
  //         new StreamResponse()
  //           .setMessage(error?.message)
  //           .setSuccess(false)
  //           .setResult(null)
  //       );
  //     }
  //   }
}
