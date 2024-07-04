import { createContext, useState } from "react";

export interface IStreamSocketContext {
  base64data: string;
  refreshSource: () => void;
}

export const StreamSocketContext = createContext<
  IStreamSocketContext | undefined
>(undefined);

/**
 * Provider for `StreamSocketContext`
 * @returns JSX.Element
 */
export function StreamSocketProvider({ children }: { children: JSX.Element }) {
  const [streamList, setStreamList] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [wsInstance, setWsInstance] = useState<WebSocket>();
  const [base64Stream, setBase64Stream] = useState("ws://localhost:7000/v1/test");

  const data: IStreamSocketContext = {
    base64data: base64Stream,
    refreshSource() {
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
  };

  return (
    <StreamSocketContext.Provider value={data}>
      {children}
    </StreamSocketContext.Provider>
  );
}
