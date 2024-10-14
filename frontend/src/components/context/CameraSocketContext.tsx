import { time } from "console";
import { Timeout } from "node_modules/@tanstack/react-router/dist/esm/utils";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:7000"
/**
interface of `StreamSocketContext`
 */
export interface IStreamSocketContext {
  /**
   * raw `base64` string. remember you must include `"data:image/jpeg;${base64}"` manually at client side to display the stream image
   */
  base64data: string | undefined;

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
  undefined
);

export const useStreamSocket = () => {
  const context = useContext(StreamSocketContext);
  if (context === undefined) {
    throw new Error(
      "useStreamSocket must be used inside of `<StreamSocketProvider>` component"
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
  // const [currentUrl, setCurrentUrl] = useState(BASE_URL);
  const [mytimer, setMytimer] = useState<Timeout | undefined>(undefined);

  const [base64Stream, setBase64Stream] = useState("");

  const data: IStreamSocketContext = {
    base64data: base64Stream,
    start() {
      const timer = setInterval(() => {
        fetch(`${BASE_URL}/camera`).then((value) => {
          setBase64Stream(value.body as unknown as string);
        });
      }, 500);
      setMytimer(timer);
    },
    stop() {
      clearInterval(mytimer)
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
