import "module-alias/register";

//@package
require("dotenv").config();
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit, { MemoryStore } from "express-rate-limit";

//@module
import LocalStorage from "./utils/LocalStorage";
import Logger from "./utils/Logger";
// import ErrorHandler from "./middleware/error";

//@routes
// import EventsRoute from "./routes/Events";

//@utils
// import { SocketAuthenticate } from "./utils/Authentication";
// import mongodb from "./config/mongodb";
// import UserModel from "./models/Users";
// import ParseQueryAggregate from "./utils/ParseQueryAggregate";
import EventHandler from "./events/Handler";
import { join } from "path";
import RtspStream from "./utils/RtspStream";
import { v4 } from "uuid";

class Server {
  port: any = process.env.PORT;
  app: Application = express();
  server = createServer(this.app);
  localStorage: LocalStorage;
  io: SocketServer;
  constructor() {
    this.localStorage = new LocalStorage();
    this.io = new SocketServer(this.server, {
      cors: {
        origin: "*", // process.env.CLIENT_URL,
      },
    });
    if (this.port) {
      this.preLoad();
    } else {
      throw new Error("Configuration missing!");
    }
  }

  async preLoad(): Promise<void> {
    try {
      // await mongodb(this.app);

      // @plugins
      this.app.use(helmet({ hidePoweredBy: true, frameguard: true }));
      this.app.use(
        cors({
          methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
        })
      );
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(express.json());
      this.app.use(function (req?: any, res?: any, next?: any) {
        Logger.info(
          "request",
          `${req.url} with status ${req?.statusCode || 200}`
        );
        next();
      });
      this.app.use(
        rateLimit({
          windowMs: 5 * 1000, // 5 seconds
          handler: (request, response, next, options) =>
            response.status(options.statusCode).json({
              message:
                "Terlalu banyak request dari IP ini. Coba beberapa saat lagi.",
              success: false,
            }),
          max: 100,
          standardHeaders: true,
          store: new MemoryStore(),
        })
      );
      // @todo:handle connection
      this.io.on("connection", async (socket) => {
        socket?.emit("status", "Terhubung dengan client");
        console.info("status", "Terhubung dengan client");
        const listener = (data: any) => {
          // console.log("fetch", v4());
          this.io.emit("data", Buffer.from(data, "binary").toString("base64"));
        };
        const stream = new RtspStream().listen("data", listener);

        stream.start({ rtspUrl: process.env.RTSP as string, noStdin: true });

        // Handle socket disconnection
        socket.on("disconnect", () => {
          stream.removeListener("data", listener);
          stream.stop();
          console.log("User disconnected");
        });
        // const eventHandler: EventHandler = new EventHandler("guest", {
        //   socket,
        //   io: this.io,
        //   localStorage: this.localStorage,
        //   dir: join(__dirname, "events/components"),
        // });

        // eventHandler.setEmitters({
        //   socket,
        //   // stream: new RtspStream({
        //   //   rtspUrl: "rtsp://localhost:8554/live",
        //   //   noStdin: true,
        //   // }),
        //   eventHandler,
        // });

        // eventHandler.loadAll();
      });

      // @main routes
      this.app.use(
        "/ping",
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          return res.status(200).json({
            success: true,
            message: "pong!",
          });
        }
      );
      // this.app.use("/v1/Auth", AuthRoute.router);
      // this.app.use("/v1/Users", UsersRoute.router);
      // this.app.use("/v1/Events", EventsRoute.router);

      // @todo:handle bad request
      this.app.use((err: any, req: any, res: any, next: any) => {
        if (err.status === 400 && "body" in err) {
          Logger.error("request", ` ${err}`);
          return res
            .status(400)
            .send({ success: false, message: err?.message });
        }
        next();
      });

      // @todo:handle not found
      this.app.get("*", (req: express.Request, res: express.Response) => {
        res.status(404).json({
          message: "Endpoint tidak ditemukan",
          success: false,
        });
      });
    } catch (error) {
      Logger.error("server", `Configuration failed! : ${error}`);
    }
  }

  async initialize(): Promise<void> {
    this.server.listen(this.port || 8000, () => {
      Logger.info("server", `Connected to port ${this.port}`);
    });
  }
}

new Server().initialize();
