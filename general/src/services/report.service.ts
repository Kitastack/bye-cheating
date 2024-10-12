import { Server, ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import {
  ReportRequest,
  ReportResponse,
  ReportStoreRequest,
  ReportStoreResponse,
} from "@protoc/report_pb";
import { ReportServiceService } from "@protoc/report_grpc_pb";
import ReportController from "@src/controllers/report.controller";
import { validateToken } from "@src/middlewares/authentication.middleware";
import type { RedisClientType } from "redis";
import { info } from "@src/utils/logger";

export default class ReportService {
  grpcServer: Server;
  redis: RedisClientType;

  constructor(server: Server, redis: any) {
    this.grpcServer = server;
    this.redis = redis;
  }

  async addService(): Promise<Response | void> {
    this.grpcServer.addService(ReportServiceService, {
      createReport: this.createReport,
      saveReport: this.storeReport.bind(this),
    });
  }

  async createReport(
    call: ServerUnaryCall<ReportRequest, ReportResponse>,
    callback: sendUnaryData<ReportResponse>
  ): Promise<void> {
    try {
      const streamId = call.request.getStreamid();
      const userId = call.request.getUserid();
      const title = call.request.getTitle();
      const description = call.request.getDescription();
      const isFrameStored = call.request.getIsframestored();
      const userData = await validateToken(
        call.metadata.get("token").toString()
      );

      const createdReport = await ReportController.createReport(
        userData.id,
        streamId,
        title,
        description,
        isFrameStored
      );

      callback(
        null,
        new ReportResponse()
          .setMessage(null)
          .setSuccess(true)
          .setResult(JSON.stringify(createdReport))
      );
    } catch (error: any) {
      callback(
        null,
        new ReportResponse()
          .setMessage(error?.message)
          .setSuccess(false)
          .setResult(null)
      );
    }
  }

  async storeReport(
    call: ServerUnaryCall<ReportStoreRequest, ReportStoreResponse>,
    callback: sendUnaryData<ReportStoreResponse>
  ): Promise<void> {
    try {
      const report_id = call.request.getReportId();
      const report_data = await this.redis.get(report_id);
      const userData = await validateToken(
        call.metadata.get("token").toString()
      );

      if (!report_data) {
        throw new Error("report data not found");
      }

      const success = await ReportController.updateReport(
        this.redis,
        JSON.parse(report_data) as any,
        (await this.redis.lRange(`prediction#${report_id}`, 0, -1))?.reverse(),
        (await this.redis.lRange(`frame#${report_id}`, 0, -1))?.reverse()
      );

      for await (const key_scanned of this.redis.scanIterator({
        MATCH: `*${report_id}`,
      })) {
        info("report-store", `deleting key ${key_scanned}`);
        await this.redis.del(key_scanned);
      }

      callback(
        null,
        new ReportStoreResponse()
          .setMessage("store data report")
          .setSuccess(success)
      );
    } catch (error: any) {
      callback(
        null,
        new ReportStoreResponse().setMessage(error?.message).setSuccess(false)
      );
    }
  }
}
