// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var authentication_pb = require('./authentication_pb.js');

function serialize_authentication_AuthenticationRequest(arg) {
  if (!(arg instanceof authentication_pb.AuthenticationRequest)) {
    throw new Error('Expected argument of type authentication.AuthenticationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authentication_AuthenticationRequest(buffer_arg) {
  return authentication_pb.AuthenticationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_authentication_AuthenticationResponse(arg) {
  if (!(arg instanceof authentication_pb.AuthenticationResponse)) {
    throw new Error('Expected argument of type authentication.AuthenticationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authentication_AuthenticationResponse(buffer_arg) {
  return authentication_pb.AuthenticationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthenticationServiceService = exports.AuthenticationServiceService = {
  validateToken: {
    path: '/authentication.AuthenticationService/validateToken',
    requestStream: false,
    responseStream: false,
    requestType: authentication_pb.AuthenticationRequest,
    responseType: authentication_pb.AuthenticationResponse,
    requestSerialize: serialize_authentication_AuthenticationRequest,
    requestDeserialize: deserialize_authentication_AuthenticationRequest,
    responseSerialize: serialize_authentication_AuthenticationResponse,
    responseDeserialize: deserialize_authentication_AuthenticationResponse,
  },
};

exports.AuthenticationServiceClient = grpc.makeGenericClientConstructor(AuthenticationServiceService);
