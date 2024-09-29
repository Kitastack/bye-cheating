// package: store
// file: store.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as store_pb from "./store_pb";

interface IStoreServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    temporarySave: IStoreServiceService_ItemporarySave;
    createReport: IStoreServiceService_IcreateReport;
}

interface IStoreServiceService_ItemporarySave extends grpc.MethodDefinition<store_pb.StoreRequest, store_pb.StoreResponse> {
    path: "/store.StoreService/temporarySave";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<store_pb.StoreRequest>;
    requestDeserialize: grpc.deserialize<store_pb.StoreRequest>;
    responseSerialize: grpc.serialize<store_pb.StoreResponse>;
    responseDeserialize: grpc.deserialize<store_pb.StoreResponse>;
}
interface IStoreServiceService_IcreateReport extends grpc.MethodDefinition<store_pb.StoreReportRequest, store_pb.StoreReportResponse> {
    path: "/store.StoreService/createReport";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<store_pb.StoreReportRequest>;
    requestDeserialize: grpc.deserialize<store_pb.StoreReportRequest>;
    responseSerialize: grpc.serialize<store_pb.StoreReportResponse>;
    responseDeserialize: grpc.deserialize<store_pb.StoreReportResponse>;
}

export const StoreServiceService: IStoreServiceService;

export interface IStoreServiceServer extends grpc.UntypedServiceImplementation {
    temporarySave: grpc.handleUnaryCall<store_pb.StoreRequest, store_pb.StoreResponse>;
    createReport: grpc.handleUnaryCall<store_pb.StoreReportRequest, store_pb.StoreReportResponse>;
}

export interface IStoreServiceClient {
    temporarySave(request: store_pb.StoreRequest, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    temporarySave(request: store_pb.StoreRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    temporarySave(request: store_pb.StoreRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    createReport(request: store_pb.StoreReportRequest, callback: (error: grpc.ServiceError | null, response: store_pb.StoreReportResponse) => void): grpc.ClientUnaryCall;
    createReport(request: store_pb.StoreReportRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: store_pb.StoreReportResponse) => void): grpc.ClientUnaryCall;
    createReport(request: store_pb.StoreReportRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: store_pb.StoreReportResponse) => void): grpc.ClientUnaryCall;
}

export class StoreServiceClient extends grpc.Client implements IStoreServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public temporarySave(request: store_pb.StoreRequest, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    public temporarySave(request: store_pb.StoreRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    public temporarySave(request: store_pb.StoreRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: store_pb.StoreResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: store_pb.StoreReportRequest, callback: (error: grpc.ServiceError | null, response: store_pb.StoreReportResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: store_pb.StoreReportRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: store_pb.StoreReportResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: store_pb.StoreReportRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: store_pb.StoreReportResponse) => void): grpc.ClientUnaryCall;
}
