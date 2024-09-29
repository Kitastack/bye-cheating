// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var stream_pb = require('./stream_pb.js');

function serialize_stream_StreamCreateRequest(arg) {
  if (!(arg instanceof stream_pb.StreamCreateRequest)) {
    throw new Error('Expected argument of type stream.StreamCreateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_StreamCreateRequest(buffer_arg) {
  return stream_pb.StreamCreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_StreamRequest(arg) {
  if (!(arg instanceof stream_pb.StreamRequest)) {
    throw new Error('Expected argument of type stream.StreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_StreamRequest(buffer_arg) {
  return stream_pb.StreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_StreamResponse(arg) {
  if (!(arg instanceof stream_pb.StreamResponse)) {
    throw new Error('Expected argument of type stream.StreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_StreamResponse(buffer_arg) {
  return stream_pb.StreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var StreamServiceService = exports.StreamServiceService = {
  createStream: {
    path: '/stream.StreamService/createStream',
    requestStream: false,
    responseStream: false,
    requestType: stream_pb.StreamCreateRequest,
    responseType: stream_pb.StreamResponse,
    requestSerialize: serialize_stream_StreamCreateRequest,
    requestDeserialize: deserialize_stream_StreamCreateRequest,
    responseSerialize: serialize_stream_StreamResponse,
    responseDeserialize: deserialize_stream_StreamResponse,
  },
  getStream: {
    path: '/stream.StreamService/getStream',
    requestStream: false,
    responseStream: false,
    requestType: stream_pb.StreamRequest,
    responseType: stream_pb.StreamResponse,
    requestSerialize: serialize_stream_StreamRequest,
    requestDeserialize: deserialize_stream_StreamRequest,
    responseSerialize: serialize_stream_StreamResponse,
    responseDeserialize: deserialize_stream_StreamResponse,
  },
};

exports.StreamServiceClient = grpc.makeGenericClientConstructor(StreamServiceService);
