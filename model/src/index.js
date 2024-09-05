const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(
  __dirname,
  "..",
  "..",
  "protos/video_streaming.proto"
);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneof: true,
});
const videoStreaming =
  grpc.loadPackageDefinition(packageDefinition).videoStreaming;

const app = express();
const port = 3000;

const getEnumByName = function (protoEnum, needle) {
  return protoEnum.type.value.find((p) => {
    return p.name === needle;
  });
};

const grpcClient = new videoStreaming.VideoStreaming(
  "localhost:5001",
  grpc.credentials.createInsecure()
);

console.log();

app.get("/stream", (req, res) => {
  let count = 1;
  let chunks = [];
  const call = grpcClient.getStream();
  res.writeHead(200, {
    "Content-Type": "multipart/x-mixed-replace;boundary=frame",
  });

  call.on("data", (chunk) => {
    // if (chunk.state == "COMPLETED") {
    let completeFrameBuffer = Buffer.from(chunk.data);
    res.write("--frame\r\n");
    res.write("Content-Type: image/jpeg\r\n\r\n");
    res.write(completeFrameBuffer);
    res.write("\r\n");
    completeFrameBuffer = null;
    // }
  });

  call.on("end", () => {
    console.info("end connection");
    res.end();
  });

  call.on("error", (err) => {
    console.error("err connection", err);
    res.end();
    call.cancel();
  });

  req.on("close", () => {
    console.log("Client disconnected");
    call.cancel();
  });
});

app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`);
});
