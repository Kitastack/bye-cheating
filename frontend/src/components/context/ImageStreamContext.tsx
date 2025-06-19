/* eslint-disable @typescript-eslint/no-unused-vars */
import { STREAM_URL } from "@/constant";
import { useAuthManager } from "@/hooks/useAuthManager";
import { notifications } from "@mantine/notifications";
import exp from "constants";
import { createContext, useContext, useState } from "react";

export interface IImageStreamContext {
  camName: string;
  rawUrl: string;
  mlUrl: string;
  setStreamUrl: (url: string, streamId: string) => void;
}

export const imageStreamContext = createContext<
  IImageStreamContext | undefined
>(undefined);

export function ImageStreamContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getAccessToken, refreshToken } = useAuthManager();
  const [streamId, setStreamId] = useState("");
  const [rawUrl, setRawUrl] = useState("");
  const [camName, setCamName] = useState("");
  const [mlUrl, setMlUrl] = useState("");

  async function setStreamUrl(url: string, streamId: string) {
    // check if url and  streamId are valid
    if (!url || url.trim() === "" || !streamId || streamId.trim() === "") {
      notifications.show({
        title: "Error",
        message: "Stream URL and Stream ID cannot be empty",
        color: "red",
      });
      console.error("Stream URL and Stream ID cannot be empty", url, streamId);
      return;
    }
    await refreshToken();

    // create liveID
    const response = await fetch(`${STREAM_URL}/live`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        streamId: streamId,
        expiryTimeInMinutes: 10,
      }),
    }).catch((error) => {
      console.error("Failed to create live ID", error);
      notifications.show({
        title: "Error",
        message: "Failed to create live ID",
        color: "red",
      });
      return null;
    });
    if (!response) {
      return;
    }
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to create live ID", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create live ID",
        color: "red",
      });
      return;
    }
    const data = await response.json();
    if (!data || !data.result.path) {
      console.error("Failed to create live ID", data);
      notifications.show({
        title: "Error",
        message: "Failed to create live ID",
        color: "red",
      });
      return;
    }
    const rawUrl = `${STREAM_URL}${data.result.path}`;
    const mlUrl = `${STREAM_URL}${data.result.path}?prediction=true`;
    console.log("Live ID created successfully", rawUrl, mlUrl);
    setStreamId(streamId);
    setCamName(streamId);
    setRawUrl(rawUrl);
    setMlUrl(mlUrl);
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
