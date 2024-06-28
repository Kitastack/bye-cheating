import { v4 as uuidv4 } from "uuid";
export type key = string | number;
export default class LocalStorage extends Map {
  constructor() {
    super();
  }
  async getClient(id: key): Promise<any> {
    return this.get(id);
  }
  async setClient(key: any, value: any): Promise<void> {
    // generate id
    const id = key || uuidv4();
    this.set(id, value);
    return this.get(id);
  }
  async push(key: key, value: any): Promise<void> {
    const old = this.get(key) || [];
    this.set(key, [...old, value]);
  }
  // setError(loc, title, detail) {
  //   const error = {
  //     state: {
  //       on: loc || "",
  //       at: detail.stack,
  //     },
  //     message: {
  //       title,
  //       detail: detail.message,
  //     },
  //     timestamp: new Date().getTime(),
  //   };
  //   this.push("error", error);
  // }
}
