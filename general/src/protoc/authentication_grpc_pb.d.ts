// package: authentication
// file: authentication.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as authentication_pb from "./authentication_pb";

interface IAuthenticationServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    validateToken: IAuthenticationServiceService_IvalidateToken;
}

interface IAuthenticationServiceService_IvalidateToken extends grpc.MethodDefinition<authentication_pb.AuthenticationRequest, authentication_pb.AuthenticationResponse> {
    path: "/authentication.AuthenticationService/validateToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<authentication_pb.AuthenticationRequest>;
    requestDeserialize: grpc.deserialize<authentication_pb.AuthenticationRequest>;
    responseSerialize: grpc.serialize<authentication_pb.AuthenticationResponse>;
    responseDeserialize: grpc.deserialize<authentication_pb.AuthenticationResponse>;
}

export const AuthenticationServiceService: IAuthenticationServiceService;

export interface IAuthenticationServiceServer extends grpc.UntypedServiceImplementation {
    validateToken: grpc.handleUnaryCall<authentication_pb.AuthenticationRequest, authentication_pb.AuthenticationResponse>;
}

export interface IAuthenticationServiceClient {
    validateToken(request: authentication_pb.AuthenticationRequest, callback: (error: grpc.ServiceError | null, response: authentication_pb.AuthenticationResponse) => void): grpc.ClientUnaryCall;
    validateToken(request: authentication_pb.AuthenticationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: authentication_pb.AuthenticationResponse) => void): grpc.ClientUnaryCall;
    validateToken(request: authentication_pb.AuthenticationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: authentication_pb.AuthenticationResponse) => void): grpc.ClientUnaryCall;
}

export class AuthenticationServiceClient extends grpc.Client implements IAuthenticationServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public validateToken(request: authentication_pb.AuthenticationRequest, callback: (error: grpc.ServiceError | null, response: authentication_pb.AuthenticationResponse) => void): grpc.ClientUnaryCall;
    public validateToken(request: authentication_pb.AuthenticationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: authentication_pb.AuthenticationResponse) => void): grpc.ClientUnaryCall;
    public validateToken(request: authentication_pb.AuthenticationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: authentication_pb.AuthenticationResponse) => void): grpc.ClientUnaryCall;
}
