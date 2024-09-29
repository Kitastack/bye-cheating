// package: stream
// file: stream.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as stream_pb from "./stream_pb";

interface IStreamServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createStream: IStreamServiceService_IcreateStream;
    getStream: IStreamServiceService_IgetStream;
}

interface IStreamServiceService_IcreateStream extends grpc.MethodDefinition<stream_pb.StreamCreateRequest, stream_pb.StreamResponse> {
    path: "/stream.StreamService/createStream";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stream_pb.StreamCreateRequest>;
    requestDeserialize: grpc.deserialize<stream_pb.StreamCreateRequest>;
    responseSerialize: grpc.serialize<stream_pb.StreamResponse>;
    responseDeserialize: grpc.deserialize<stream_pb.StreamResponse>;
}
interface IStreamServiceService_IgetStream extends grpc.MethodDefinition<stream_pb.StreamRequest, stream_pb.StreamResponse> {
    path: "/stream.StreamService/getStream";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stream_pb.StreamRequest>;
    requestDeserialize: grpc.deserialize<stream_pb.StreamRequest>;
    responseSerialize: grpc.serialize<stream_pb.StreamResponse>;
    responseDeserialize: grpc.deserialize<stream_pb.StreamResponse>;
}

export const StreamServiceService: IStreamServiceService;

export interface IStreamServiceServer extends grpc.UntypedServiceImplementation {
    createStream: grpc.handleUnaryCall<stream_pb.StreamCreateRequest, stream_pb.StreamResponse>;
    getStream: grpc.handleUnaryCall<stream_pb.StreamRequest, stream_pb.StreamResponse>;
}

export interface IStreamServiceClient {
    createStream(request: stream_pb.StreamCreateRequest, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    createStream(request: stream_pb.StreamCreateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    createStream(request: stream_pb.StreamCreateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    getStream(request: stream_pb.StreamRequest, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    getStream(request: stream_pb.StreamRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    getStream(request: stream_pb.StreamRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
}

export class StreamServiceClient extends grpc.Client implements IStreamServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createStream(request: stream_pb.StreamCreateRequest, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    public createStream(request: stream_pb.StreamCreateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    public createStream(request: stream_pb.StreamCreateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    public getStream(request: stream_pb.StreamRequest, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    public getStream(request: stream_pb.StreamRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
    public getStream(request: stream_pb.StreamRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: stream_pb.StreamResponse) => void): grpc.ClientUnaryCall;
}
