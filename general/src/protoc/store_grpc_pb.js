// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var store_pb = require('./store_pb.js');

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
  saveReport: {
    path: '/store.StoreService/saveReport',
    requestStream: false,
    responseStream: false,
    requestType: store_pb.StoreRequest,
    responseType: store_pb.StoreResponse,
    requestSerialize: serialize_store_StoreRequest,
    requestDeserialize: deserialize_store_StoreRequest,
    responseSerialize: serialize_store_StoreResponse,
    responseDeserialize: deserialize_store_StoreResponse,
  },
};

exports.StoreServiceClient = grpc.makeGenericClientConstructor(StoreServiceService);
