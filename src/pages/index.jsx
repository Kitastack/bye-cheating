import { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export const WebSocketDemo = () => {
  const [socketUrl, setSocketUrl] = useState("wss://echo.websocket.org");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const getBlobUrl = (data) => {
    try {
      return `data:image/jpeg;base64, ${data}`;
    } catch {
      return null;
    }
  };

  useEffect(() => {}, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("ws://localhost:8080/v1/test"),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send Hello
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {(lastMessage?.data && (
        <img width={500} src={getBlobUrl(lastMessage?.data)}></img>
      )) ||
        "null"}
    </div>
  );
};

export default WebSocketDemo;
