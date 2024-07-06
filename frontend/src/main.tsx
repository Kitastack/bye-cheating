import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StreamSocketProvider } from "./context/CameraSocketContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!!).render(
  <React.StrictMode>
    <AuthProvider>
      <StreamSocketProvider>
        <App />
      </StreamSocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
