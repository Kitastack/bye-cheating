const { spawn } = require("child_process");
const EventEmitter = require("events");

module.exports = class Streamer extends EventEmitter {
  constructor(channel, url, client, proto) {
    super();
    this.proto = proto;
    this.client = client;
    this.channel = channel;
    this.url = url;
    this.sessionId = null;
    this.media = null;
    this.streamState = null;
  }

  async _responseWatcher(responseIterator) {
    try {
      if (!responseIterator) {
        throw new Error();
      }
      for await (const response of responseIterator) {
        if (response?.stream_info) {
          this.onStreamInfo(response.stream_info);
        } else if (response?.stream_state) {
          this.onStreamState(response?.stream_state?.state);
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.error(
        "Received StreamResponse without stream_info and stream_state",
        error
      );
    }
  }

  onStreamInfo(streamInfo) {
    this.sessionId = streamInfo.getSessionId();
    this.media = streamInfo.getMedia();
  }

  onStreamState(state) {
    console.log(`Stream toward [${this.url}] enters [${state}] state`);

    this.streamState = state;
    if (state === "ACTIVE") {
      this.emit("peerResponded");
    } else if (state === "ENDED") {
      this.emit("peerResponded");
      this.emit("callFinished");
    }
  }

  async stream() {
    const responseIterator = this.client.StreamingRTSP({ url: this.url });
    // console.log(responseIterator);
    this._responseWatcher(responseIterator);

    // Spawn a separate process to consume the response stream (non-blocking)
    const child = spawn("node", [
      "-e",
      `const responseIterator = process.stdin; (async () => { await new Streamer()._responseWatcher(responseIterator); })()`,
    ]);
    responseIterator.pipe(child.stdin); // Pipe responses to the child process
    return new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              "Child process for response consumption exited with code:",
              code
            )
          );
        }
      });
    });
  }

  async waitPeer() {
    console.log(`Waiting for peer to connect [${this.url}]...`);
    this.emit("peerResponded");
    return this.streamState === "ACTIVE";
  }

  mediaSession() {
    if (!this.media) {
      throw new Error("Media not available");
    }
    console.log(`Consuming media resource [${this.media}]`);
    return this.emit("callFinished");
  }
};
