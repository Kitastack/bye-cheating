import {
  Server as grpcServer,
  ServerUnaryCall,
  sendUnaryData,
} from "@grpc/grpc-js";
import {
  AuthenticationRequest,
  AuthenticationResponse,
  AuthenticationResult,
} from "@protoc/authentication_pb";
import { AuthenticationServiceService } from "@protoc/authentication_grpc_pb";
import { join } from "path";
import { validateToken } from "@src/middlewares/authentication.middleware";

export default class AuthenticationService {
  grpcServer: grpcServer;
  constructor(server: grpcServer) {
    this.grpcServer = server;
  }

  async addService(): Promise<Response | void> {
    this.grpcServer.addService(AuthenticationServiceService, {
      validateToken: (
        call: ServerUnaryCall<AuthenticationRequest, AuthenticationResponse>,
        callback: sendUnaryData<AuthenticationResponse>
      ) => {
        try {
          const token = call.request.getToken();
          const payload = validateToken(token);

          const result = new AuthenticationResult();
          result.setId(payload.id);
          result.setUsername(payload.username);
          result.setEmail(payload.email);
          result.setCreateddate(payload.createdDate);
          result.setIat(payload.iat);
          result.setExp(payload.exp);
          result.setToken(token);

          const response = new AuthenticationResponse();
          response.setMessage("Token valid");
          response.setSuccess(true);
          response.setResult(result);
          callback(null, response);
        } catch (error: any) {
          const response = new AuthenticationResponse();
          response.setMessage(error?.message ?? "Token invalid");
          response.setSuccess(false);
          response.setResult(null);
          callback(null, response);
        }
      },
    });
  }
}
