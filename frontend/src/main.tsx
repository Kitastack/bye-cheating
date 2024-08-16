import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource/poppins";
import "@fontsource-variable/karla";
import "@/index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import i18n from "@/lib/i18n";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StreamSocketProvider } from "./context/CameraSocketContext";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { I18nextProvider } from "react-i18next";

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
  fontFamily: "Poppins,Karla, sans-serif",
  // headings: {fontFamily:"Poppins, sans-serif"},
  primaryColor: "myColor",
});

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications />
        <ModalsProvider>
          <BrowserRouter>
            <AuthProvider>
              <StreamSocketProvider>
                <App />
              </StreamSocketProvider>
            </AuthProvider>
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </I18nextProvider>
  </React.StrictMode>
);
