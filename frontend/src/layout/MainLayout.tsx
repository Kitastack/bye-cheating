import { Outlet } from "react-router-dom";
import NavbarContent from "../components/sidebar";
import { AppShell, Burger, Group } from "@mantine/core";
import TitleDashboard from "@/components/titleDashboard";
import { useDisclosure } from "@mantine/hooks";

export default function MainLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  return (
    <AppShell
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened},
      }}
      header={{ height: 100 }}
    >
      <AppShell.Navbar>
        <NavbarContent />
      </AppShell.Navbar>
      <AppShell.Header>
        <TitleDashboard
          leftSection={
            <>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
            </>
          }
        />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer zIndex={300}>
        <Group w={"100%"} h={"100%"} bg={"myColor"} px={8}>
          <p>this is footer</p>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
