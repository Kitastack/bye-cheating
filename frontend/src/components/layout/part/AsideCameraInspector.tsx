import {
  Accordion,
  Divider,
  Flex,
  Card,
  Group,
  ActionIcon,
  Text,
  Stack,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import { AddCameraModalContent } from "../../main/AddCameraModal";
import { useContext, useEffect, useState } from "react";
import { useCameraManagement } from "@/hooks/useCameraManagement";
import { IImageStreamContext, imageStreamContext } from "@/components/context/ImageStreamContext";

function CameraItem({
  url,
  streamId,
  onClick,
  actionButtons,
}: {
  streamId: string;
  url: string;
  onClick: (url: string) => void;
  actionButtons?: React.ReactNode;
}) {
  return (
    <Card
      padding={"xs"}
      radius={"sm"}
      withBorder
      onClick={() => {
        onClick(url);
      }}
      className="w-full cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <Group justify="space-between">
        <Stack gap={0}>
          <div className="text-gray-500 text-[8px]">{streamId}</div>
          <Text fw={400} size="sm">
            {url}
          </Text>
        </Stack>
        {actionButtons}
      </Group>
    </Card>
  );
}

export function AsideCameraInspector() {
  const { cameras, addCamera, fetchCameras } = useCameraManagement();
  const [aInit, setAInit] = useState(true);
  const {setStreamUrl} = useContext(imageStreamContext) as IImageStreamContext;

  useEffect(() => {
    if (aInit) {
      fetchCameras();
      setAInit(false);
    }
  }, []);

  function handleAddCamera() {
    modals.open({
      title: "Tambah Kamera",
      children: (
        <AddCameraModalContent
          onSubmit={(url) => {
            addCamera(url);
            fetchCameras();
            modals.closeAll();
          }}
        />
      ),
    });
  }

  return (
    <div className="flex flex-col p-2 gap-2 w-full h-full">
      <Accordion variant="contained">
        <Accordion.Item value="metadata">
          <Accordion.Control>Metadata</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">URL: rtsp://localhost:8888/a301.live</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Divider />
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>Daftar Kamera</Text>
        <ActionIcon
          variant="subtle"
          onClick={() => {
            fetchCameras();
          }}
        >
          <IconRefresh />
        </ActionIcon>
        <ActionIcon variant="filled" onClick={handleAddCamera}>
          <IconPlus />
        </ActionIcon>
      </Flex>
      <Flex
        direction={"column"}
        justify={"start"}
        align={"center"}
        gap={"md"}
        className="flex-grow"
      >
        {cameras.length > 0 ? (
          cameras.map((val, i) => (
            <CameraItem
              onClick={(url) => {
                console.log("Selected URL:", url);
              }}
              url={val.url}
              key={i}
              streamId={val.id}
              actionButtons={
                <ActionIcon
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStreamUrl(val.url, val.id);
                  }}
                >
                  <IconPlayerPlay />
                </ActionIcon>
              }
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            kamera kosong
          </div>
        )}
      </Flex>
    </div>
  );
}
