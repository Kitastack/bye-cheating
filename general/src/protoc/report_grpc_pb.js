// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var report_pb = require('./report_pb.js');

function serialize_report_ReportRequest(arg) {
  if (!(arg instanceof report_pb.ReportRequest)) {
    throw new Error('Expected argument of type report.ReportRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_report_ReportRequest(buffer_arg) {
  return report_pb.ReportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_report_ReportResponse(arg) {
  if (!(arg instanceof report_pb.ReportResponse)) {
    throw new Error('Expected argument of type report.ReportResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_report_ReportResponse(buffer_arg) {
  return report_pb.ReportResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ReportServiceService = exports.ReportServiceService = {
  createReport: {
    path: '/report.ReportService/createReport',
    requestStream: false,
    responseStream: false,
    requestType: report_pb.ReportRequest,
    responseType: report_pb.ReportResponse,
    requestSerialize: serialize_report_ReportRequest,
    requestDeserialize: deserialize_report_ReportRequest,
    responseSerialize: serialize_report_ReportResponse,
    responseDeserialize: deserialize_report_ReportResponse,
  },
};

exports.ReportServiceClient = grpc.makeGenericClientConstructor(ReportServiceService);
