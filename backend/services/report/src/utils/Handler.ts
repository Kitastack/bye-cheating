import { Server, Socket } from "socket.io";
import { resolve, join, extname } from "path";
import { readdirSync, statSync } from "fs";
import { EventEmitter } from "stream";
import Wrapper from "./Wrapper";
import LocalStorage from "./LocalStorage";

export default class Handler extends EventEmitter {
  protected dir: string;
  protected moduleHandle: any;
  protected socket: Socket;
  protected io: Server | null;
  protected localStorage: LocalStorage;
  emitters: Map<string, any | EventEmitter | any> | null = null;
  id: string;
  extensions: Set<any>;
  modules: Map<string, any>;
  constructor(
    id: string,
    opts: {
      localStorage: LocalStorage;
      socket: Socket;
      io: Server | null;
      dir: string;
      extensions?: string[];
      moduleHandle?: any;
    }
  ) {
    super();
    this.id = id;
    this.localStorage = opts.localStorage;
    this.io = opts.io;
    this.socket = opts.socket;
    this.extensions = new Set(opts.extensions || [".js", ".ts"]);
    this.dir = opts.dir;
    this.moduleHandle = opts.moduleHandle || Wrapper;
    this.modules = new Map();
  }

  protected readdirRecursive(directory: any) {
    const result = [];
    (function read(dir) {
      const files = readdirSync(dir);
      for (const file of files) {
        const filepath = join(dir, file);
        if (statSync(filepath).isDirectory()) {
          read(filepath);
        } else {
          result.push(filepath);
        }
      }
    })(directory);
    return result;
  }

  async preload(module: any, filepath: any): Promise<void> {
    module.filepath = filepath;
    module.socket = this.socket;
    module.user = this.id;
    module.localStorage = this.localStorage;
    module.handler = this;
    module.emitters = this.emitters;
    this.modules.set(module.id, module);
    console.info(`Module ${module.id} has ready ✅`);
  }

  async load(file: any): Promise<any> {
    const isClass = typeof file === "function";
    if (!isClass && !this.extensions.has(extname(file as string))) {
      return undefined;
    }
    let module = isClass ? file : require(file).default;
    if (module && module.prototype instanceof this.moduleHandle) {
      module = new module(this);
    } else {
      if (!isClass) {
        delete require.cache[require.resolve(file as string)];
      }
      return undefined;
    }
    if (this.modules.has(module.id)) throw new Error("Sudah Ke Load !!");
    await this.preload(module, isClass ? null : file);
    return module;
  }

  async loadAll(): Promise<any> {
    const filepaths = this.readdirRecursive(this.dir);
    filepaths.forEach((filepath) => {
      filepath = resolve(filepath);
      this.load(filepath);
    });
    this.socket.emit("status", "Koneksi Berhasil");
    return this;
  }
}
