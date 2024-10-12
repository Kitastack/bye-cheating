// package: report
// file: report.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as report_pb from "./report_pb";

interface IReportServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createReport: IReportServiceService_IcreateReport;
    saveReport: IReportServiceService_IsaveReport;
}

interface IReportServiceService_IcreateReport extends grpc.MethodDefinition<report_pb.ReportRequest, report_pb.ReportResponse> {
    path: "/report.ReportService/createReport";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<report_pb.ReportRequest>;
    requestDeserialize: grpc.deserialize<report_pb.ReportRequest>;
    responseSerialize: grpc.serialize<report_pb.ReportResponse>;
    responseDeserialize: grpc.deserialize<report_pb.ReportResponse>;
}
interface IReportServiceService_IsaveReport extends grpc.MethodDefinition<report_pb.ReportStoreRequest, report_pb.ReportStoreResponse> {
    path: "/report.ReportService/saveReport";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<report_pb.ReportStoreRequest>;
    requestDeserialize: grpc.deserialize<report_pb.ReportStoreRequest>;
    responseSerialize: grpc.serialize<report_pb.ReportStoreResponse>;
    responseDeserialize: grpc.deserialize<report_pb.ReportStoreResponse>;
}

export const ReportServiceService: IReportServiceService;

export interface IReportServiceServer extends grpc.UntypedServiceImplementation {
    createReport: grpc.handleUnaryCall<report_pb.ReportRequest, report_pb.ReportResponse>;
    saveReport: grpc.handleUnaryCall<report_pb.ReportStoreRequest, report_pb.ReportStoreResponse>;
}

export interface IReportServiceClient {
    createReport(request: report_pb.ReportRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    saveReport(request: report_pb.ReportStoreRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ReportStoreResponse) => void): grpc.ClientUnaryCall;
    saveReport(request: report_pb.ReportStoreRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ReportStoreResponse) => void): grpc.ClientUnaryCall;
    saveReport(request: report_pb.ReportStoreRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ReportStoreResponse) => void): grpc.ClientUnaryCall;
}

export class ReportServiceClient extends grpc.Client implements IReportServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createReport(request: report_pb.ReportRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    public saveReport(request: report_pb.ReportStoreRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ReportStoreResponse) => void): grpc.ClientUnaryCall;
    public saveReport(request: report_pb.ReportStoreRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ReportStoreResponse) => void): grpc.ClientUnaryCall;
    public saveReport(request: report_pb.ReportStoreRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ReportStoreResponse) => void): grpc.ClientUnaryCall;
}
