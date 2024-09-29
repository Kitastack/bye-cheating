// package: stream
// file: stream.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class StreamRequest extends jspb.Message { 
    getStreamid(): string;
    setStreamid(value: string): StreamRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StreamRequest): StreamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamRequest;
    static deserializeBinaryFromReader(message: StreamRequest, reader: jspb.BinaryReader): StreamRequest;
}

export namespace StreamRequest {
    export type AsObject = {
        streamid: string,
    }
}

export class StreamCreateRequest extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): StreamCreateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamCreateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StreamCreateRequest): StreamCreateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamCreateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamCreateRequest;
    static deserializeBinaryFromReader(message: StreamCreateRequest, reader: jspb.BinaryReader): StreamCreateRequest;
}

export namespace StreamCreateRequest {
    export type AsObject = {
        url: string,
    }
}

export class StreamResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): StreamResponse;
    getSuccess(): boolean;
    setSuccess(value: boolean): StreamResponse;
    getResult(): string;
    setResult(value: string): StreamResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StreamResponse): StreamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamResponse;
    static deserializeBinaryFromReader(message: StreamResponse, reader: jspb.BinaryReader): StreamResponse;
}

export namespace StreamResponse {
    export type AsObject = {
        message: string,
        success: boolean,
        result: string,
    }
}
