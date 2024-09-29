// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var store_pb = require('./store_pb.js');

function serialize_store_StoreReportRequest(arg) {
  if (!(arg instanceof store_pb.StoreReportRequest)) {
    throw new Error('Expected argument of type store.StoreReportRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_store_StoreReportRequest(buffer_arg) {
  return store_pb.StoreReportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_store_StoreReportResponse(arg) {
  if (!(arg instanceof store_pb.StoreReportResponse)) {
    throw new Error('Expected argument of type store.StoreReportResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_store_StoreReportResponse(buffer_arg) {
  return store_pb.StoreReportResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_store_StoreRequest(arg) {
  if (!(arg instanceof store_pb.StoreRequest)) {
    throw new Error('Expected argument of type store.StoreRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_store_StoreRequest(buffer_arg) {
  return store_pb.StoreRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_store_StoreResponse(arg) {
  if (!(arg instanceof store_pb.StoreResponse)) {
    throw new Error('Expected argument of type store.StoreResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_store_StoreResponse(buffer_arg) {
  return store_pb.StoreResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var StoreServiceService = exports.StoreServiceService = {
  temporarySave: {
    path: '/store.StoreService/temporarySave',
    requestStream: false,
    responseStream: false,
    requestType: store_pb.StoreRequest,
    responseType: store_pb.StoreResponse,
    requestSerialize: serialize_store_StoreRequest,
    requestDeserialize: deserialize_store_StoreRequest,
    responseSerialize: serialize_store_StoreResponse,
    responseDeserialize: deserialize_store_StoreResponse,
  },
  createReport: {
    path: '/store.StoreService/createReport',
    requestStream: false,
    responseStream: false,
    requestType: store_pb.StoreReportRequest,
    responseType: store_pb.StoreReportResponse,
    requestSerialize: serialize_store_StoreReportRequest,
    requestDeserialize: deserialize_store_StoreReportRequest,
    responseSerialize: serialize_store_StoreReportResponse,
    responseDeserialize: deserialize_store_StoreReportResponse,
  },
};

exports.StoreServiceClient = grpc.makeGenericClientConstructor(StoreServiceService);
