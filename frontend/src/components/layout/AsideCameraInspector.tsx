import {
  Accordion,
  Divider,
  Flex,
  Button,
  Card,
  Group,
  ActionIcon,
  Text,
  Center,
  Menu,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconPlus,
  IconDotsVertical,
  IconTrash,
  IconCamera,
} from "@tabler/icons-react";
import { AddCameraModal, AddCameraModalContent } from "../main/AddCameraModal";
import { useState } from "react";
import { useCameraManagement } from "@/hooks/useCameraManagement";

interface CameraListItem {
  name: string;
  url: string;
}

function CameraItem({
  name,
  url,
  onCameraRemoved
}: {
  name: string;
  url: string;
  onCameraRemoved: (url: string) => void;
}) {
  return (
    <Card
      padding={"xs"}
      radius={"sm"}
      onClick={() => {
        console.log(`url ${url} is selected`);
      }}
      withBorder
    >
      <Group justify="space-between">
        <Group align="center">
          <IconCamera style={{ width: rem(20), height: rem(20) }} />
          <Text fw={400} size="sm">
            {name}
          </Text>
        </Group>
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
            onClick={() => {
              onCameraRemoved(url);
            }}
              leftSection={
                <IconTrash
                  color="red"
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Delete Camera
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
}

export function AsideCameraInspector() {
  const { cameras, addCamera, removeCamera } = useCameraManagement();
  return (
    <div className="flex flex-col p-2 gap-2 w-full">
      <Accordion variant="contained">
        <Accordion.Item value="metadata">
          <Accordion.Control>Metadata</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">URL: rtsp://localhost:8888/a301.live</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Divider />

      <Text fw={600}>Daftar Kamera</Text>
      <Flex direction={"column"} gap={"md"}>
        <Button
          variant="outline"
          style={{ borderStyle: "dashed", cursor: "pointer" }}
          onClick={() => {
            modals.open({
              title: "Tambah Kamera",
              children: (
                <AddCameraModalContent
                  onSubmit={(name, url) => {
                    addCamera(name, url);
                    modals.closeAll();
                  }}
                />
              ),
            });
          }}
          radius={"sm"}
        >
          <Flex align={"center"} justify={"center"}>
            <IconPlus size={18} />
            <Text size="sm">Add Camera</Text>
          </Flex>
        </Button>
        {cameras.length > 0 ? (
          cameras.map((val, i) => (
            <CameraItem
              key={i}
              onCameraRemoved={() => removeCamera(val.url)}
              name={val.name}
              url={val.url}
            />
          ))
        ) : (
          <Center>kamera kosong</Center>
        )}
      </Flex>
    </div>
  );
}
