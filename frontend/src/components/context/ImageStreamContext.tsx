/* eslint-disable @typescript-eslint/no-unused-vars */
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

  async function setStreamUrl(name: string, streamId: string, reportId: string) {

    const url = `${STREAM_URL}/stream/${streamId}/watch?width=860&height=480`;
    const mlUrl = `${STREAM_URL}/stream/${streamId}/watch?width=860&height=480&raw=false`;
    
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