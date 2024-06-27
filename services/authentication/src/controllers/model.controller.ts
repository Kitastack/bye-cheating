import { Context } from "hono";
import { Users } from "@models/index";
import { generateToken } from "@utils/token";
import { randomUUID } from "node:crypto";
import { pagination } from "@utils/pagination";
import { errorHandler } from "@middlewares/error.middleware";
import queryParser from "@utils/queryParser";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

export const getPredict = upgradeWebSocket((_) => ({
    onOpen(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      
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