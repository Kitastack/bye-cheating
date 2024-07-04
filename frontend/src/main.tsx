import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StreamSocketProvider } from "./context/CameraSocketContext";

ReactDOM.createRoot(document.getElementById("root")!!).render(
  <React.StrictMode>
    <StreamSocketProvider>
      <App />
    </StreamSocketProvider>
  </React.StrictMode>
);
