import SidebarContent from "@/components/layout/part/SidebarContent";
import {
  AppShell,
  Burger,
} from "@mantine/core";
import TitleDashboard from "@/components/titleDashboard";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "@tanstack/react-router";
import { useAside } from "@/components/context/AsideContext";

export default function MainLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [asideMobileOpened] = useDisclosure();
  const {asideComponent} = useAside()
  return (
      <AppShell
        navbar={{
          width: 300,

          breakpoint: "md",
          collapsed: { mobile: !mobileOpened },
        }}
        header={{ height: 100 }}
        aside={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !asideMobileOpened },
        }}
        // layout="alt"
      >
        <AppShell.Navbar>
          <SidebarContent />
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
        <AppShell.Aside>
          {asideComponent}
        </AppShell.Aside>
        <AppShell.Main className="flex flex-col">
          <Outlet />
        </AppShell.Main>
        {/* <AppShell.Footer zIndex={300}>
        <Group w={"100%"} h={"100%"} bg={"myColor"} px={8}>
          <p>this is footer</p>
        </Group>
      </AppShell.Footer> */}
      </AppShell>
  );
}



// const RtspInput = () => {
//   return (
//     <>
//       <TextInput
//         label="RTSP URL"
//         placeholder="rtsp://urlname"
//         rightSection={
//           <ActionIcon variant="filled">
//             <IconPlayerPlay size={16} />
//           </ActionIcon>
//         }
//       />
//     </>
//   );
// };
