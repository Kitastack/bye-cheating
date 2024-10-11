// package: store
// file: store.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class StoreRequest extends jspb.Message { 
    getReportId(): string;
    setReportId(value: string): StoreRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StoreRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StoreRequest): StoreRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StoreRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StoreRequest;
    static deserializeBinaryFromReader(message: StoreRequest, reader: jspb.BinaryReader): StoreRequest;
}

export namespace StoreRequest {
    export type AsObject = {
        reportId: string,
    }
}

export class StoreResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): StoreResponse;
    getSuccess(): boolean;
    setSuccess(value: boolean): StoreResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StoreResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StoreResponse): StoreResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StoreResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StoreResponse;
    static deserializeBinaryFromReader(message: StoreResponse, reader: jspb.BinaryReader): StoreResponse;
}

export namespace StoreResponse {
    export type AsObject = {
        message: string,
        success: boolean,
    }
}
