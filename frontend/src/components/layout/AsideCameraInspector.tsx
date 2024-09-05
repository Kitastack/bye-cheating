import { Accordion, Divider, Flex, Button, Card, Group, ActionIcon, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { AddCameraModalContent } from "../main/AddCameraModal";

export function AsideCameraInspector() {
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
                children: <AddCameraModalContent onSubmit={() => { } } />,
              });
            } }
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
  }