import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io";
import { io } from "socket.io-client";

/**
interface of `StreamSocketContext`
 */
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
   * start new connection to websocket source, and don't create new instance if existing instance is active.
   *
   * Please close the existing instance by call `stop()` if you want to call this function
   * @returns
   */
  start: () => void;
  /**
   * Stop all connection to websocsket source
   * @returns
   */
  stop: () => void;
}

const StreamSocketContext = createContext<IStreamSocketContext | undefined>(
  undefined,
);

export const useStreamSocket = () => {
  const context = useContext(StreamSocketContext);
  if (context === undefined) {
    throw new Error(
      "useStreamSocket must be used inside of `<StreamSocketProvider>` component",
    );
  }
  return context as IStreamSocketContext;
};

/**
 * Provider for `StreamSocketContext`
 * @returns JSX.Element
 */
export function StreamSocketProvider({ children }: { children: JSX.Element }) {
  const initialized = useRef(false);
  const [currentUrl, setCurrentUrl] = useState("http://localhost:7000");
  const [wsInstance, setWsInstance] = useState<WebSocket | undefined>(
    undefined,
  );

  const [socketInstance, setSocketInstance] = useState<Socket | undefined>(
    undefined,
  );

  const [base64Stream, setBase64Stream] = useState("");

  const data: IStreamSocketContext = {
    base64data: base64Stream,
    setWebsocketURL(url) {
      setCurrentUrl(url);
    },
    start() {
      if (socketInstance) {
        return;
      }

      setSocketInstance((prevVal) => {
        if (prevVal) {
          return prevVal;
        }
        const socket = io(currentUrl);
        socket.on("connect", () => {
          console.log(`socket established: ${socket.id}`);
        });
        socket.on("disconnect", () => {
          console.log(`socket closed: ${socket.id}`);
        });
        socket.on("data", (val) => {
          console.log(`data: ${val}`);
          setBase64Stream(val)
        });
        return socket as unknown as Socket;
      });

      // if (wsInstance) {
      //   this.stop();
      // }
      // const ws = new WebSocket(currentUrl);
      // ws.onopen = (ev) => {
      //   console.log(`connection established`)
      // }
      // ws.onmessage = (ev) => {
      //   setBase64Stream(ev.data);
      // };
      // ws.onclose = (ev) => {
      //   console.log("WS: close from");
      //   ev.stopPropagation();
      // };
      // setWsInstance(ws);
    },
    stop() {
      wsInstance?.close();
      socketInstance?.disconnect(true);
      setWsInstance(undefined);
      setSocketInstance(undefined);
    },
  };

  //INITIALIZE
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      data.start();
    }
    return () => {
      data.stop();
    };
  }, []);

  return (
    <StreamSocketContext.Provider value={data}>
      {children}
    </StreamSocketContext.Provider>
  );
}
