import { EventEmitter } from "events";
import Wrapper from "../utils/Wrapper";
import { IRTSPListeners, FfmpegEvents } from "../utils/RtspStream";

type IEvents = FfmpegEvents | "start";

export default abstract class Event extends Wrapper {
  public emitter: string | EventEmitter;
  public event: IEvents;
  public type: string;
  public id: string;
  constructor(
    id: string,
    {
      emitter,
      event,
      type = "on",
    }: {
      emitter: string | EventEmitter;
      event: IEvents;
      type?: "on" | "once";
    }
  ) {
    super(id);
    this.id = id;
    this.emitter = emitter;
    this.event = event;
    this.type = type;
  }
  abstract exec({ ...args }: IRTSPListeners | any): Promise<void>;
}
