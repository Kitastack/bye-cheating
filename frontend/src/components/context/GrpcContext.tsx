

export interface IGrpcContext {
    setStreamCollector:(listener: (data: string) => void) => void;
    switchSteamChannel: (streamId: string) => void;
    startStream : () => void;
    stopStream: () => void;
}