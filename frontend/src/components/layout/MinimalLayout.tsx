import TitleDashboard from "@/components/titleDashboard";
import { AppShell } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import React from "react";

export function MinimalLayout({ children }: { children?: React.ReactNode }) {
  return (
    <AppShell>
      <AppShell.Header>
        <TitleDashboard leftSection={<></>} />
      </AppShell.Header>
      <AppShell.Main>{children ?? <Outlet />}</AppShell.Main>
    </AppShell>
  );
}
