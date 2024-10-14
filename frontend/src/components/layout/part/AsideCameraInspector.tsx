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
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { AddCameraModalContent } from "../../main/AddCameraModal";
import { useContext, useEffect, useState } from "react";
import { useCameraManagement } from "@/hooks/useCameraManagement";
import { IImageStreamContext, imageStreamContext, useImageStream } from "@/components/context/ImageStreamContext";

interface CameraListItem {
  name: string;
  url: string;
}

function CameraItem({ name, url }: { name: string; url: string }) {
  return (
    <Card padding={"xs"} radius={"sm"} withBorder>
      <Group justify="space-between">
        <Text fw={400} size="sm">
          {name}
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical />
        </ActionIcon>
      </Group>
    </Card>
  );
}

export function AsideCameraInspector() {
  const { cameras, addCamera, removeCamera,syncCameras } = useCameraManagement();
  const {setStreamUrl} = useContext(
    imageStreamContext
  ) as IImageStreamContext;
  const [aInit, setAInit] = useState(true)
  useEffect(()=> {
    if(aInit) {
      syncCameras()
      setAInit(false)
    }
  },[])
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
            <Card key={i} padding={"xs"} radius={"sm"} withBorder onClick={() => {
              setStreamUrl(val.title,val.streamId,"")
            }}>
              <Group justify="space-between">
                <Text fw={400} size="sm">
                  {val.title}
                </Text>
                <Menu>
                  <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDotsVertical />
                  </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => {
                        removeCamera(val.id);
                      }}
                    >
                      Delete Camera
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card>
          ))
        ) : (
          <Center>kamera kosong</Center>
        )}
      </Flex>
    </div>
  );
}
