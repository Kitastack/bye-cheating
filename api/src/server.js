require("dotenv").config();

const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_FILENAME = "video_streaming.proto";
const PROTO_PATH = path.join(__dirname, PROTO_FILENAME);

const videoStreamingDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneof: true,
});

const videoStreaming = grpc.loadPackageDefinition(
  videoStreamingDefinition
).videoStreaming;

const app = express();
const port = 3000;

const errorHandler = (req, res) => {
  res.setHeader("content-type", "application/json");
  res.status(500).send({
    status: false,
    message: "internal server error",
  });
  // process.exit(1);
};

app.get("/stream", (req, res) => {
  let call;
  const grpcClient = new videoStreaming.VideoStreaming(
    String(process.env.RTSP_SERVER),
    grpc.credentials.createInsecure()
  );
  try {
    call = grpcClient.getStream({ url: process.env.RTSP_URL });
    if (!call) {
      throw new Error("cannot estabilish the connection to grpc");
    }

    res.writeHead(200, {
      "Content-Type": "multipart/x-mixed-replace;boundary=frame",
    });

    call.on("data", (chunk) => {
      let completeFrameBuffer = Buffer.from(chunk.data);
      res.write("--frame\r\n");
      res.write("Content-Type: image/jpeg\r\n\r\n");
      res.write(completeFrameBuffer);
      res.write("\r\n");
      completeFrameBuffer = null;
    });

    call.on("end", () => {
      console.info("connection ended by stream utils");
      res.end();
    });

    call.on("error", (error) => {
      res.end();
      throw new Error(error);
    });

    req.on("close", () => {
      console.info("connection closed by client");
      res.end();
      call.cancel();
    });
  } catch (error) {
    console.error("error", error);
    if (call) call?.cancel();
    errorHandler(req, res);
  }
});

app.get("/stream/model", (req, res) => {
  let call;
  const grpcClient = new videoStreaming.VideoStreaming(
    String(process.env.RTSP_SERVER),
    grpc.credentials.createInsecure()
  );
  try {
    call = grpcClient.getStreamModel({ url: process.env.RTSP_URL });
    if (!call) {
      throw new Error("cannot estabilish the connection to grpc");
    }

    res.writeHead(200, {
      "Content-Type": "multipart/x-mixed-replace;boundary=frame",
    });

    call.on("data", (chunk) => {
      let completeFrameBuffer = Buffer.from(chunk.data);
      res.write("--frame\r\n");
      res.write("Content-Type: image/jpeg\r\n\r\n");
      res.write(completeFrameBuffer);
      res.write("\r\n");
      completeFrameBuffer = null;
    });

    call.on("end", () => {
      console.info("connection ended by stream utils");
      res.end();
    });

    call.on("error", (error) => {
      res.end();
      throw new Error(error);
    });

    req.on("close", () => {
      console.info("connection closed by client");
      res.end();
      call.cancel();
    });
  } catch (error) {
    console.error("error", error);
    if (call) call?.cancel();
    errorHandler(req, res);
  }
});

app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`);
});
