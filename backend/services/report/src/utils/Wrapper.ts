import EventEmitter from "events";
import { Socket as SocketServer } from "socket.io";
import Logger from "./Logger";
import LocalStorage from "./LocalStorage";

export type ILogger = "warn" | "error" | "info";

export default class Wrapper {
  id: string;
  user: string | null = null;
  localStorage: LocalStorage | null = null;
  socket: SocketServer | null = null;
  emitters: Map<string, any | EventEmitter | any> | null = null;
  filepath?: string;
  handler?: any;
  constructor(id: string) {
    this.id = id;
    this.socket?.on("status", (x) => this.logger("info", x));
  }
  reSort(data: Array<any>, page: number, total: number): Array<any> {
    const end = total * page;
    return data.slice(end - total, end);
  }
  logger(
    type: ILogger,
    msg: string | any,
    id: string = this.id || "-",
    rest: any | null = ""
  ) {
    Logger.info(type, `event/${this.socket?.id}/`);
  }
}
