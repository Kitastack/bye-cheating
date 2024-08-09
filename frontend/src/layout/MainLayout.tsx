import { Outlet } from "react-router-dom";
import NavbarContent from "../components/sidebar";
import {
  Accordion,
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Text,
  TextInput,
} from "@mantine/core";
import TitleDashboard from "@/components/titleDashboard";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconPlayerPlay,
  IconPlus,
} from "@tabler/icons-react";

export default function MainLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [asideMobileOpened] = useDisclosure();
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
      <AppShell.Aside>
        <Inspector />
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

const Inspector = () => {
  return (
    <div className="flex flex-col p-2 gap-2 w-full">
      <Accordion variant="contained">
        <Accordion.Item value="metadata">
          <Accordion.Control>Metadata</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">URL: rtsp://localhost:8888/a301.live</Text>
            <RtspInput />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Divider />

      <Text fw={600}>Daftar Kamera</Text>
      <Flex direction={"column"} gap={"md"}>
        <Button
          variant="outline"
          style={{ borderStyle: "dashed", cursor: "pointer" }}
          onClick={() => {}}
          radius={"sm"}
        >
          <Flex align={"center"} justify={"center"}>
            <IconPlus size={18} />
            <Text size="sm">Add Camera</Text>
          </Flex>
        </Button>
        <Card padding={"xs"} radius={"sm"} withBorder>
          <Group justify="space-between">
            <Text fw={400} size="sm">
              Camera 2
            </Text>
            <ActionIcon variant="subtle">
              <IconDotsVertical />
            </ActionIcon>
          </Group>
        </Card>
      </Flex>
    </div>
  );
};

const RtspInput = () => {
  return (
    <>
      <TextInput
        label="RTSP URL"
        placeholder="rtsp://urlname"
        rightSection={
          <ActionIcon variant="filled">
            <IconPlayerPlay size={16} />
          </ActionIcon>
        }
      />
    </>
  );
};
