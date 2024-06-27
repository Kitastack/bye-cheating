import { Context, Next } from "hono";
import rtsp from "rtsp-ffmpeg";

export const useRTSP = async (c: Context, next: Next) => {
  let stream = new rtsp.FFMpeg({
    input: "rtsp://admin:@psti2012@192.168.145.4:554/Streaming/Channels/1", // "rtsp://localhost:8554/mystream",
    resolution: "1024x768",
    quality: 5,
  });

  c.set("stream", stream);
  await next();
};
