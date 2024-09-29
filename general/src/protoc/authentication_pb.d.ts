// package: authentication
// file: authentication.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class AuthenticationResult extends jspb.Message { 
    getId(): string;
    setId(value: string): AuthenticationResult;
    getToken(): string;
    setToken(value: string): AuthenticationResult;
    getUsername(): string;
    setUsername(value: string): AuthenticationResult;
    getEmail(): string;
    setEmail(value: string): AuthenticationResult;
    getCreateddate(): string;
    setCreateddate(value: string): AuthenticationResult;
    getIat(): number;
    setIat(value: number): AuthenticationResult;
    getExp(): number;
    setExp(value: number): AuthenticationResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticationResult.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticationResult): AuthenticationResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticationResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticationResult;
    static deserializeBinaryFromReader(message: AuthenticationResult, reader: jspb.BinaryReader): AuthenticationResult;
}

export namespace AuthenticationResult {
    export type AsObject = {
        id: string,
        token: string,
        username: string,
        email: string,
        Createddate: string,
        iat: number,
        exp: number,
    }
}

export class AuthenticationRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): AuthenticationRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticationRequest): AuthenticationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticationRequest;
    static deserializeBinaryFromReader(message: AuthenticationRequest, reader: jspb.BinaryReader): AuthenticationRequest;
}

export namespace AuthenticationRequest {
    export type AsObject = {
        token: string,
    }
}

export class AuthenticationResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): AuthenticationResponse;
    getSuccess(): boolean;
    setSuccess(value: boolean): AuthenticationResponse;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): AuthenticationResult | undefined;
    setResult(value?: AuthenticationResult): AuthenticationResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticationResponse): AuthenticationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticationResponse;
    static deserializeBinaryFromReader(message: AuthenticationResponse, reader: jspb.BinaryReader): AuthenticationResponse;
}

export namespace AuthenticationResponse {
    export type AsObject = {
        message: string,
        success: boolean,
        result?: AuthenticationResult.AsObject,
    }
}
