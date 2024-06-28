import {
  ChildProcessWithoutNullStreams,
  SpawnSyncReturns,
  spawn,
  spawnSync,
  exec,
  ChildProcess,
} from "child_process";
import * as fs from "fs";
import os from "os";
import jimp from "jimp";
import { EventEmitter } from "stream";
import { v4 } from "uuid";

interface FfmpegOptions {
  noStdin?: boolean;
  rtspUrl: string;
  format?: string;
}

export type FfmpegEvents = "data" | "end";
export type IPayload = { options: FfmpegOptions; data: Buffer };

export type IRTSPListeners = (...args: [IPayload]) => void;

export default class RtspStream extends EventEmitter {
  private ffmpegProcess?: ChildProcess | ChildProcessWithoutNullStreams; // Store FFmpeg process
  options?: FfmpegOptions | null = null;
  id?: string;
  buffs: Array<any> = [];

  constructor(options?: FfmpegOptions) {
    super();
    this.options = options;
    this.id = v4();
  }

  start(options: FfmpegOptions): void {
    // this.createFifo(this.id);

    if (this.ffmpegProcess) {
      // todo:Clean up previous process (if any)
      // todo:Send SIGINT signal to terminate
      this.ffmpegProcess.kill("SIGINT");
    }

    const args = ["-noautorotate", "-loglevel", "quiet"]
      .concat([
        "-i",
        options.rtspUrl,
        // "-r",
        // Number(24).toString(),
        "-q:v",
        Number(2).toString(),
      ])
      .concat([
        // this.quality ? ['-q:v', this.quality.toString()] : [],
        // this.resolution ? ['-s', this.resolution] : [],
        "-f",
        "image2",
        "-update",
        "1",
        "-",
      ]);
    // [
    //   ...(options?.noStdin ? ["-nostdin"] : []),
    //   "-i",
    //   options?.rtspUrl || "",
    //   ...(options.format ? ["-f", options.format] : []),
    //   // "-vf",
    //   // "select=eq(n,0)",
    //   "-f",
    //   "image2",
    //   "-update",
    //   "1",
    //   "-",
    //   // "-pix_fmt",
    //   // "rgb24",
    //   // `pipe:`,
    // ];
    // if (os.hostname().indexOf("docker") !== -1) {
    //   this.ffmpegProcess = exec(
    //     ["ffmpeg"].concat(args).join(" "),
    //     (error, stdout, stderr) => {
    //       if (stderr) {
    //         this.emit("end", stderr);
    //       } else if (error) {
    //         console.error("FFmpeg error:", error);
    //         this.emit("error", error);
    //       } else {
    //         const _stdout = Buffer.from(stdout);

    //         // Attach typed event listeners to FFmpeg streams
    //         if (_stdout.length > 1) {
    //           this.buffs.push(_stdout);

    //           let offset = _stdout[_stdout.length - 2].toString(16);
    //           let offset2 = _stdout[_stdout.length - 1].toString(16);

    //           if (offset == "ff" && offset2 == "d9") {
    //             this.emit("data", Buffer.concat(this.buffs));
    //             this.buffs = [];
    //           }
    //         }
    //       }
    //     }
    //   );
    // } else {
    this.ffmpegProcess = spawn("ffmpeg", args);

    // Attach typed event listeners to FFmpeg streams
    this.ffmpegProcess.stdout?.on("data", (data: Buffer) => {
      if (data.length > 1) {
        this.buffs.push(data);

        let offset = data[data.length - 2].toString(16);
        let offset2 = data[data.length - 1].toString(16);

        if (offset == "ff" && offset2 == "d9") {
          this.emit("data", Buffer.concat(this.buffs));
          this.buffs = [];
        }
      }
    });

    this.ffmpegProcess.stderr?.on("data", (error) => {
      console.error("FFmpeg error:", error);
      this.emit("error", error);
    });

    this.ffmpegProcess.on("exit", (code) => {
      console.log("FFmpeg exited with code:", code);
      this.emit("end"); // Emit end event when ffmpeg closes
    });
    // }

    console.log(["ffmpeg"].concat(args).join(" "));
  }

  // Function to add a new listener (flexible for any event type)
  listen(eventName: FfmpegEvents, listener: IRTSPListeners): this {
    return super.addListener(eventName, listener);
  }

  // Function to remove a listener (flexible for any event type)
  removeListener(eventName: FfmpegEvents, listener: IRTSPListeners): this {
    return super.removeListener(eventName, listener);
  }

  // Clean up resources (optional)
  stop(): void {
    if (this.options?.rtspUrl) {
      fs.rmSync(this.options.rtspUrl);
    }
    if (this.ffmpegProcess) {
      this.ffmpegProcess.kill("SIGINT"); // Terminate FFmpeg if still running
    }
  }

  createFifo(
    fifoPath: string = "/tmp/rtsp_fifo"
  ): SpawnSyncReturns<Buffer> | null {
    if (!fs.existsSync(fifoPath)) {
      try {
        const result = spawnSync("mkfifo", [fifoPath]);
        console.log("Fifo created: " + fifoPath);
        return result;
      } catch (error) {
        console.error("Error creating FIFO:", error);
        return null;
      }
    }
    return null;
  }

  readFromFifo(fifoPath: string = "/tmp/rtsp_fifo") {
    const bufferSize = 1024; // Adjust buffer size as needed
    const buffer = Buffer.alloc(bufferSize);

    // Read data from FIFO into the buffer
    const bytesRead = fs.readSync(
      fs.openSync(fifoPath, "r"),
      buffer,
      0,
      bufferSize,
      null
    );

    if (bytesRead > 0) {
      // Process the received image buffer
      console.log("Received image buffer:", buffer.toString("hex")); // Example output
      // Alternatively, you can use libraries like Jimp or sharp for image manipulation
      return buffer;
      //processImageBuffer(buffer); // Replace with your image processing function
    } else {
      console.log("No data available in FIFO");
    }
  }
}
