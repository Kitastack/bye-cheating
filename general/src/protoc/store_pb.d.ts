// package: store
// file: store.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class StoreRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): StoreRequest;
    getPayload(): string;
    setPayload(value: string): StoreRequest;
    getRawimage(): Uint8Array | string;
    getRawimage_asU8(): Uint8Array;
    getRawimage_asB64(): string;
    setRawimage(value: Uint8Array | string): StoreRequest;
    getPredictedimage(): Uint8Array | string;
    getPredictedimage_asU8(): Uint8Array;
    getPredictedimage_asB64(): string;
    setPredictedimage(value: Uint8Array | string): StoreRequest;

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
        id: string,
        payload: string,
        rawimage: Uint8Array | string,
        predictedimage: Uint8Array | string,
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

export class StoreReportRequest extends jspb.Message { 
    getStreamid(): string;
    setStreamid(value: string): StoreReportRequest;
    getUserid(): string;
    setUserid(value: string): StoreReportRequest;
    getTitle(): string;
    setTitle(value: string): StoreReportRequest;
    getDescription(): string;
    setDescription(value: string): StoreReportRequest;
    getIsframestored(): boolean;
    setIsframestored(value: boolean): StoreReportRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StoreReportRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StoreReportRequest): StoreReportRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StoreReportRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StoreReportRequest;
    static deserializeBinaryFromReader(message: StoreReportRequest, reader: jspb.BinaryReader): StoreReportRequest;
}

export namespace StoreReportRequest {
    export type AsObject = {
        streamid: string,
        userid: string,
        title: string,
        description: string,
        isframestored: boolean,
    }
}

export class StoreReportResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): StoreReportResponse;
    getSuccess(): boolean;
    setSuccess(value: boolean): StoreReportResponse;
    getResult(): string;
    setResult(value: string): StoreReportResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StoreReportResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StoreReportResponse): StoreReportResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StoreReportResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StoreReportResponse;
    static deserializeBinaryFromReader(message: StoreReportResponse, reader: jspb.BinaryReader): StoreReportResponse;
}

export namespace StoreReportResponse {
    export type AsObject = {
        message: string,
        success: boolean,
        result: string,
    }
}
