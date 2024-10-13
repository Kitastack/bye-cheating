import { Server, ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { StreamServiceService } from "@protoc/stream_grpc_pb";
import StreamController from "@src/controllers/stream.controller";
import { validateToken } from "@src/middlewares/authentication.middleware";
import {
  StreamRequest,
  StreamResponse,
  StreamCreateRequest,
} from "@protoc/stream_pb";
import { Stream } from "@prisma/client";

export default class StreamService {
  protected grpcServer: Server;
  constructor(server: Server) {
    this.grpcServer = server;
  }

  async addService(): Promise<Response | void> {
    this.grpcServer.addService(StreamServiceService, {
      getStream: this.getStream,
      createStream: this.createStream,
    });
  }

  async getStream(
    call: ServerUnaryCall<StreamRequest, StreamResponse>,
    callback: sendUnaryData<StreamResponse>
  ): Promise<void> {
    try {
      // await validateToken(call.metadata.get("token").toString());
      const streamId = call.request.getStreamid();
      const getStream = await StreamController.getStream(streamId);
      callback(
        null,
        new StreamResponse()
          .setSuccess(true)
          .setResult(JSON.stringify(getStream))
      );
    } catch (error: any) {
      callback(
        null,
        new StreamResponse()
          .setMessage(error?.message)
          .setSuccess(false)
          .setResult(null)
      );
    }
  }

  async createStream(
    call: ServerUnaryCall<StreamCreateRequest, StreamResponse>,
    callback: sendUnaryData<StreamResponse>
  ): Promise<void> {
    try {
      const streamUrl = call.request.getUrl();
      const userData = await validateToken(
        call.metadata.get("token").toString()
      );
      const createdStream = await StreamController.createStream({
        url: streamUrl,
        userId: userData.id,
      } as Stream);
      callback(
        null,
        new StreamResponse()
          .setMessage(null)
          .setSuccess(true)
          .setResult(JSON.stringify(createdStream))
      );
    } catch (error: any) {
      callback(
        null,
        new StreamResponse()
          .setMessage(error?.message)
          .setSuccess(false)
          .setResult(null)
      );
    }
  }
}
