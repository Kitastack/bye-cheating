import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource/poppins";
import "@fontsource-variable/karla";
import "@/index.css";
import "@mantine/core/styles.css";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StreamSocketProvider } from "./context/CameraSocketContext";

const container = document.getElementById("root") as ReactDOM.Container;

const myColor: MantineColorsTuple = [
  "#fff4e2",
  "#ffe9cc",
  "#ffd09c",
  "#fdb766",
  "#fca13a",
  "#fb931d",
  "#fc8c0c",
  "#e17900",
  "#c86a00",
  "#ae5a00",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <StreamSocketProvider>
            <App />
          </StreamSocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
