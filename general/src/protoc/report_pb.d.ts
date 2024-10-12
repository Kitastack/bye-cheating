// package: report
// file: report.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class ReportRequest extends jspb.Message { 
    getStreamid(): string;
    setStreamid(value: string): ReportRequest;
    getUserid(): string;
    setUserid(value: string): ReportRequest;
    getTitle(): string;
    setTitle(value: string): ReportRequest;
    getDescription(): string;
    setDescription(value: string): ReportRequest;
    getIsframestored(): boolean;
    setIsframestored(value: boolean): ReportRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ReportRequest): ReportRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReportRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportRequest;
    static deserializeBinaryFromReader(message: ReportRequest, reader: jspb.BinaryReader): ReportRequest;
}

export namespace ReportRequest {
    export type AsObject = {
        streamid: string,
        userid: string,
        title: string,
        description: string,
        isframestored: boolean,
    }
}

export class ReportResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): ReportResponse;
    getSuccess(): boolean;
    setSuccess(value: boolean): ReportResponse;
    getResult(): string;
    setResult(value: string): ReportResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ReportResponse): ReportResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReportResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportResponse;
    static deserializeBinaryFromReader(message: ReportResponse, reader: jspb.BinaryReader): ReportResponse;
}

export namespace ReportResponse {
    export type AsObject = {
        message: string,
        success: boolean,
        result: string,
    }
}

export class ReportStoreRequest extends jspb.Message { 
    getReportId(): string;
    setReportId(value: string): ReportStoreRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportStoreRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ReportStoreRequest): ReportStoreRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReportStoreRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportStoreRequest;
    static deserializeBinaryFromReader(message: ReportStoreRequest, reader: jspb.BinaryReader): ReportStoreRequest;
}

export namespace ReportStoreRequest {
    export type AsObject = {
        reportId: string,
    }
}

export class ReportStoreResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): ReportStoreResponse;
    getSuccess(): boolean;
    setSuccess(value: boolean): ReportStoreResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportStoreResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ReportStoreResponse): ReportStoreResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReportStoreResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportStoreResponse;
    static deserializeBinaryFromReader(message: ReportStoreResponse, reader: jspb.BinaryReader): ReportStoreResponse;
}

export namespace ReportStoreResponse {
    export type AsObject = {
        message: string,
        success: boolean,
    }
}
