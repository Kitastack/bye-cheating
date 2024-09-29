import { Server as grpcServer, ServerCredentials } from "@grpc/grpc-js";
import dotenv from "dotenv";
import { info as loggerInfo, error as loggerError } from "@utils/logger";
import rateLimit, { MemoryStore } from "express-rate-limit";
import { testDBConnection } from "@src/config/prisma.db";
import express, { Application } from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import UserRoutes from "@routes/user.routes";
import AuthenticationRoutes from "@routes/authentication.routes";
import AuthenticationService from "@services/authentication.service";
import StreamService from "@services/stream.service";
import ReportService from "./services/report.service";
dotenv.config({ path: path.join(__dirname, ".env") });

class Server {
  port: number = +(process.env.PORT ?? 8080);
  app: Application = express();
  server = createServer(this.app);
  grpcServer = new grpcServer();

  async preload(): Promise<void> {
    await testDBConnection();
  }

  async plugins(): Promise<void> {
    try {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(helmet({ hidePoweredBy: true, frameguard: true }));
      this.app.use(
        cors({
          methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
          origin: "*", // []
        })
      );
      this.app.use(function (req?: any, res?: any, next?: any) {
        loggerInfo(
          "request",
          `${req.url} with status ${req?.statusCode || 200}`
        );
        next();
      });
      this.app.use(
        rateLimit({
          windowMs: 2500, // 2.5s]
          handler: (request, response, next, options) =>
            response.status(options.statusCode).json({
              message:
                "Terlalu banyak request dari IP ini. Coba beberapa saat lagi.",
              success: false,
            }),
          max: 2,
          standardHeaders: true,
          store: new MemoryStore(),
        })
      );
    } catch (error) {
      loggerError("server", `plugins failed : ${error}`);
    }
  }

  async routes(): Promise<void> {
    try {
      this.app.use("/authentication", AuthenticationRoutes.router);
      this.app.use("/user", UserRoutes.router);
      this.app.use(
        "/ping",
        async (
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
      this.app.use((err: any, req: any, res: any, next: any) => {
        if (err.status === 400 && "body" in err) {
          loggerError("request", ` ${err}`);
          return res
            .status(400)
            .send({ success: false, message: err?.message });
        }
        next();
      });
      this.app.get("*", (req: express.Request, res: express.Response) => {
        res.status(404).json({
          message: "endpoint not found",
          success: false,
        });
      });
    } catch (error: any) {
      loggerError("error", error?.message);
    }
  }

  async startGrpcServer(): Promise<void> {
    new AuthenticationService(this.grpcServer).addService();
    new StreamService(this.grpcServer).addService();
    new ReportService(this.grpcServer).addService();

    this.grpcServer.bindAsync(
      `${process.env.GRPC_HOST ?? "0.0.0.0"}:${process.env.GRPC_PORT ?? 50051}`,
      ServerCredentials.createInsecure(),
      (error: any, port: any) => {
        if (error) {
          loggerError("failed to bind server", error);
        } else {
          loggerInfo("grpc-server", `server bound to port ${port}`);
        }
      }
    );
  }

  async startMainServer(): Promise<void> {
    this.server.listen(this.port, () => {
      loggerInfo("server", `connected to port http://localhost:${this.port}`);
    });
  }

  async initialize(): Promise<void> {
    await this.preload();
    await this.plugins();
    await this.routes();
    this.startGrpcServer();
    this.startMainServer();
  }
}

new Server().initialize();
