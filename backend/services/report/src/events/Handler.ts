import { Server, Socket as SocketServer } from "socket.io";
import LocalStorage from "../utils/LocalStorage";
import Handler from "../utils/Handler";
import Event from "./index";
import { EventEmitter } from "stream";

export default class EventHandler extends Handler {
  emitters: Map<string, any | EventEmitter | any>;
  constructor(
    id: string,
    {
      dir,
      moduleHandle = Event,
      extensions = [".js", ".ts"],
      localStorage,
      socket,
      io,
    }: {
      dir: string;
      moduleHandle?: any;
      extensions?: Array<string>;
      localStorage: LocalStorage;
      socket: SocketServer;
      io: Server | null;
    }
  ) {
    super(id, { localStorage, socket, io, dir, moduleHandle, extensions });
    this.emitters = new Map();
  }

  async preload(event: Event, filepath: string): Promise<void> {
    super.preload(event, filepath);
    try {
      event.exec = event.exec.bind(event);
      this.addToEmitter(event.id);
    } catch (error) {
      console.log(error);
    }
  }
  protected checkIsEventEmitter(event: any) {
    return (
      event &&
      typeof event.on === "function" &&
      typeof event.emit === "function"
    );
  }
  public setEmitters(emitters: {}) {
    for (const [key, value] of Object.entries(emitters)) {
      if (!this.checkIsEventEmitter(value)) throw new Error("event invalid");
      this.emitters.set(key, value);
    }
    // @ts-ignore due to manual emit
    super.emitters = this.emitters;
    console.log(this.emitters);
    return this;
  }

  protected addToEmitter(id: string) {
    const TheEvent: any = this.modules.get(id.toString());
    if (!TheEvent) throw new Error("event ga ada");
    const emitter = this.checkIsEventEmitter(TheEvent)
      ? TheEvent.emitter
      : this.emitters.get(TheEvent.emitter);
    if (!this.checkIsEventEmitter(emitter)) throw new Error("emitter ga ada");

    if (TheEvent.type === "once") {
      emitter.once(TheEvent.event, TheEvent.exec);
    } else emitter.on(TheEvent.event, TheEvent.exec);
    return TheEvent;
  }
}
