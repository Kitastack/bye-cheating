const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Streamer = require("./streamer");

const PROTO_PATH = path.join(__dirname, "..", "..", "protos/streaming.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protobuf = grpc.loadPackageDefinition(packageDefinition);
const streamingProto = protobuf.streaming;
const app = express();

app.get("/", (req, res) => {
  const rtsp_url = "rtsp://localhost:8554/mystream";

  streaming_rtsp(rtsp_url, (error, response) => {
    if (error) {
      res.status(500).send("Error new: " + error.message);
    } else {
      res.send("ok");
    }
  });
  // res.sendStatus(201);
});

function streaming_rtsp(rtsp_url, callback) {
  const channel = grpc.credentials.createInsecure();
  const client = new streamingProto.Streaming(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  const streamer = new Streamer(channel, rtsp_url, client, streamingProto);
  streamer
    .stream()
    .then(() => streamer.waitPeer())
    .then((isActive) => {
      if (isActive) {
        return streamer
          .audioSession()
          .then(() => console.log("Stream finished!"));
      }
      console.log("Stream failed: peer didn't answer");
    });

  // const call = client.StreamingRTSP({ rtsp_url });
  // call.on("data", (response) => {
  //   callback(response);
  // });
  // call.on("error", (error) => {
  //   console.error("Error baru:", error);
  //   callback(null, error);
  // });
  // client.StreamingRTSP({ rtsp_url }, (err, response) => {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     callback(null, response);
  //   }
  // });
}

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
