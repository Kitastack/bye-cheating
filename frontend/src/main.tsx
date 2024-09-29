import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/poppins";
import "@fontsource-variable/karla";
import "@/index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import i18n from "@/lib/i18n";
import { MantineProvider } from "@mantine/core";
import { StreamSocketProvider } from "./components/context/CameraSocketContext";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { I18nextProvider } from "react-i18next";
import { appTheme } from "./theme";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root") as ReactDOM.Container;

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <MantineProvider theme={appTheme} defaultColorScheme="light">
        <Notifications />
        <ModalsProvider>
          <StreamSocketProvider>
            <RouterProvider router={router}  />
          </StreamSocketProvider>
        </ModalsProvider>
      </MantineProvider>
    </I18nextProvider>
  </React.StrictMode>
);
