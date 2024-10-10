import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/poppins";
import "@fontsource-variable/karla";
import "@/index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
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
    <MantineProvider theme={appTheme} defaultColorScheme="light">
      <Notifications />
      <ModalsProvider>
          <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
