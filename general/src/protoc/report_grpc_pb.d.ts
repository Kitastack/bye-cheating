// package: report
// file: report.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as report_pb from "./report_pb";

interface IReportServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createReport: IReportServiceService_IcreateReport;
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

export const ReportServiceService: IReportServiceService;

export interface IReportServiceServer extends grpc.UntypedServiceImplementation {
    createReport: grpc.handleUnaryCall<report_pb.ReportRequest, report_pb.ReportResponse>;
}

export interface IReportServiceClient {
    createReport(request: report_pb.ReportRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
}

export class ReportServiceClient extends grpc.Client implements IReportServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createReport(request: report_pb.ReportRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
    public createReport(request: report_pb.ReportRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ReportResponse) => void): grpc.ClientUnaryCall;
}
