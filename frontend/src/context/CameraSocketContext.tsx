import { createContext, useState } from "react";

export interface IStreamSocketContext {
  /**
   * raw `base64` string. remember you must include `"data:image/jpeg;${base64}"` manually at client side to display the stream image
   */
  base64data: string | undefined;

  /**
   * change websocket url, changing this won't stop the current running websocket.
   * @param url - websocket url, ex: `ws://localhost/v1/test`
   * @returns
   */
  setWebsocketURL: (url: string) => void;
  /**
   * call `stop()` if the existing websocket is available, and start new connection to websocket source.
   * @returns
   */
  startOrReload: () => void;
  /**
   * Stop all connection to websocsket source
   * @returns
   */
  stop: () => void;
}

export const StreamSocketContext = createContext<
  IStreamSocketContext | undefined
>(undefined);

/**
 * Provider for `StreamSocketContext`
 * @returns JSX.Element
 */
export function StreamSocketProvider({ children }: { children: JSX.Element }) {
  const [currentUrl, setCurrentUrl] = useState("ws://localhost:7000/v1/test");
  const [wsInstance, setWsInstance] = useState<WebSocket | null>();

  const [base64Stream, setBase64Stream] = useState("");

  const data: IStreamSocketContext = {
    base64data: base64Stream,
    setWebsocketURL(url) {
      setCurrentUrl(url);
    },
    startOrReload() {
      if (wsInstance) {
        this.stop();
      }
      const ws = new WebSocket(currentUrl);
      ws.onmessage = (ev) => {
        setBase64Stream(ev.data);
      };
      ws.onclose = (ev) => {
        console.log("WS: close from");
        ev.stopPropagation();
      };
      setWsInstance(ws);
    },
    stop() {
      wsInstance?.close();
      setWsInstance(null);
    },
  };

  return (
    <StreamSocketContext.Provider value={data}>
      {children}
    </StreamSocketContext.Provider>
  );
}
