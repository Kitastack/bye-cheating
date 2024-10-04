import { createContext, useState } from "react";

export interface IImageStreamContext {
  camName: string;
  rawUrl: string;
  mlUrl: string;
  setStreamUrl: (name: string, url: string) => void;
}

const imageStreamContext = createContext<IImageStreamContext | undefined>(
  undefined
);

export function ImageStreamContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rawUrl, setRawUrl] = useState("");
  const [camName, setCamName] = useState("");
  const [mlUrl, setMlUrl] = useState("");

  function setStreamUrl(name: string, url: string) {
    setRawUrl(url);
    setMlUrl(url);
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
