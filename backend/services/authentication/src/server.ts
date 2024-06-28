import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { errorHandler, notFoundHandler } from "@middlewares/index";
import { users } from "@routes/index";
import axios from "axios";
import { FormDataEncoder } from "form-data-encoder";
import mongoDB from "@utils/db";
import rtsp from "rtsp-ffmpeg";

const app = new Hono().basePath("/v1");
const { upgradeWebSocket, websocket } = createBunWebSocket();

// todo:initialize middlewares
mongoDB();
app.use("*", logger(), prettyJSON());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// todo:socket
let count = 0;
const topic = "anonymous";
let stream = new rtsp.FFMpeg({
  input: "rtsp://host.docker.internal:8554/mystream", // "rtsp://host.docker.internal:8554/mystream", //"rtsp://admin:@psti2012@192.168.145.4:554/Streaming/Channels/1", //
  resolution: "1024x768",
  quality: 5,
});
let delay = false;
let currentImage: any = null;
console.log("here ---", Bun.env.MODEL_SERVICE_URL);
const pipeStream =
  (socket: ServerWebSocket<undefined>) => async (data: any) => {
    console.log("test jalan", typeof data);
    try {
      if (delay == false) {
        delay = !delay;
        setTimeout(() => (delay = !delay), 3000);
        // try {
        const form = new FormData();
        form.append("fileBase64", data.toString("base64"));

        const response = await axios.post(
          `${Bun.env.MODEL_SERVICE_URL}/detect`,
          form,
          { responseType: "arraybuffer", timeout: 3000 }
        );
        // response.data?.image
        console.log("success");
        socket.send(Buffer.from(response.data, "binary").toString("base64"));
        // console.log(response);
        // socket.send(response.data?.image);
        // } catch (error) {
        //   // console.log(error);
        //   console.log("timeout");
        //   throw error
        // }
      }
    } catch (error) {
      console.log("timeout");
      socket.send(data.toString("base64"));
    }
  };

app.get(
  "/test",
  upgradeWebSocket((_) => ({
    onOpen(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.subscribe(topic);
      console.log("rtsp://localhost:8554/mystream");
      stream.on("data", pipeStream(rawWs));
      stream.on("error", () => {
        console.log("errono");
      });
      stream.start();
      console.log(stream);
      console.log(`WebSocket server opened and subscribed to topic '${topic}'`);
    },
    onClose(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.unsubscribe(topic);
      console.log(
        `WebSocket server closed and unsubscribed from topic '${topic}'`
      );
      stream.removeListener("data", pipeStream(rawWs));
    },
    onError(event, ws) {
      console.log(`message errro`, ws);
    },
    onMessage(event, ws) {
      console.log(`message ${event?.data ?? ""}`);
      ws.send("hello from server");
    },
  }))
);

app.route("/users", users);

app.notFound((c) => {
  const notFound = notFoundHandler(c);
  return notFound;
});

app.onError((err, c) => {
  const error = errorHandler(c);
  return error;
});

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 8000,
  websocket, // handlers
});
