import { Server, ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { ReportRequest, ReportResponse } from "@protoc/report_pb";
import { ReportServiceService } from "@protoc/report_grpc_pb";
import ReportController from "@src/controllers/report.controller";
import { validateToken } from "@src/middlewares/authentication.middleware";

export default class ReportService {
  protected grpcServer: Server;
  constructor(server: Server) {
    this.grpcServer = server;
  }

  async addService(): Promise<Response | void> {
    this.grpcServer.addService(ReportServiceService, {
      createReport: this.createReport,
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
      const userData = validateToken(call.metadata.get("token").toString());

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
}
