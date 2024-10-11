// package: store
// file: store.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as store_pb from "./store_pb";

interface IStoreServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    saveReport: IStoreServiceService_IsaveReport;
}

interface IStoreServiceService_IsaveReport extends grpc.MethodDefinition<store_pb.StoreRequest, store_pb.StoreResponse> {
    path: "/store.StoreService/saveReport";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<store_pb.StoreRequest>;
    requestDeserialize: grpc.deserialize<store_pb.StoreRequest>;
    responseSerialize: grpc.serialize<store_pb.StoreResponse>;
    responseDeserialize: grpc.deserialize<store_pb.StoreResponse>;
}

export const StoreServiceService: IStoreServiceService;

export interface IStoreServiceServer extends grpc.UntypedServiceImplementation {
    saveReport: grpc.handleUnaryCall<store_pb.StoreRequest, store_pb.StoreResponse>;
}

export interface IStoreServiceClient {
    saveReport(request: store_pb.StoreRequest, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    saveReport(request: store_pb.StoreRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    saveReport(request: store_pb.StoreRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
}

export class StoreServiceClient extends grpc.Client implements IStoreServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public saveReport(request: store_pb.StoreRequest, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    public saveReport(request: store_pb.StoreRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    public saveReport(request: store_pb.StoreRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
}
