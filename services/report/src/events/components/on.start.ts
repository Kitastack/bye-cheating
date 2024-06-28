import Event from "..";
import { IPayload } from "../../utils/RtspStream";
export default class onReady extends Event {
  constructor() {
    super("onStart", {
      emitter: "stream",
      event: "data",
      type: "on",
    });
  }
  async exec(args: IPayload): Promise<void> {
    console.log("listening from ", args.options.rtspUrl);
    // this.socket?.emit("status", "Siap Digunakan");
    // this.socket?.emit("ready", true);
  }
}
