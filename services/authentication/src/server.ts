import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { errorHandler, notFoundHandler } from "@middlewares/index";
import { users } from "@routes/index";
import { FormData as FormDataNode } from "formdata-node";
import { Readable } from "stream";
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
  input: "rtsp://localhost:8554/mystream", //"rtsp://admin:@psti2012@192.168.145.4:554/Streaming/Channels/1", //
  resolution: "1024x768",
  quality: 5,
});
let delay = false;
let currentImage: any = null;
const pipeStream =
  (socket: ServerWebSocket<undefined>) => async (data: any) => {
    // console.log(typeof data);
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
      stream.on("data", pipeStream(rawWs));
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
    onMessage(event, ws) {
      console.log(`message ${event?.data ?? ""}`);
      ws.send("hello from server");
    },
  }))
);

// todo:routes
app.get("/hello", async (c) => {
  return c.json({
    message: "hello",
  });
});
app.route("/users", users);

// todo:validate middlewares
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
  port: process.env.PORT,
  websocket, // handlers
});
