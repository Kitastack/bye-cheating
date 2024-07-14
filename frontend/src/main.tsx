import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource/poppins";
import "@fontsource-variable/karla";
import "./index.css";

const container = document.getElementById("root") as ReactDOM.Container;

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
