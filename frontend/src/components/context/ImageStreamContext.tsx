import { STREAM_URL } from "@/constant";
import { useAuthManager } from "@/hooks/useAuthManager";
import { createContext, useContext, useState } from "react";

export interface IImageStreamContext {
  camName: string;
  rawUrl: string;
  mlUrl: string;
  setStreamUrl: (name: string, streamId: string, reportId: string) => void;
}

export const imageStreamContext = createContext<IImageStreamContext | undefined>(
  undefined
);

export function ImageStreamContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [streamId, setStreamId] = useState("");
  const [reportId, setReportId] = useState("");
  const [rawUrl, setRawUrl] = useState("");
  const [camName, setCamName] = useState("");
  const [mlUrl, setMlUrl] = useState("");
  const { getAccessToken } = useAuthManager();

  async function start() {
    // const response = await fetch(`${STREAM_URL}/report/start`, )
  }

  async function setStreamUrl(name: string, streamId: string, reportId: string) {
    const token = await getAccessToken();
    if (!token) {
      return;
    }
    const tokens = `${btoa(token)}`;

    const url = `${STREAM_URL}/stream/${streamId}/watch?width=640&height=480&token=${tokens}`;
    const mlUrl = `${STREAM_URL}/stream/${streamId}/watch?raw=False&width=640&height=480&token=${tokens}`;
    
    setReportId(reportId)
    setStreamId(streamId)
    setRawUrl(url);
    setMlUrl(mlUrl);
    setCamName(name);
  }

  return (
    <imageStreamContext.Provider
      value={{
        mlUrl,
        rawUrl,
        camName,
        setStreamUrl,
      }}
    >
      {children}
    </imageStreamContext.Provider>
  );
}