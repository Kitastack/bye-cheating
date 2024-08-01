import TitleDashboard from "@/components/titleDashboard";
import { AppShell } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";

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
