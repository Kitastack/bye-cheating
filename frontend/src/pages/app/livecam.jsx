import { ImageStreamViewer } from "@/components/ImageStreamViewer";
import { useStreamSocket } from "@/context/CameraSocketContext";
import {IconCamera, IconTable} from "@tabler/icons-react"
import {
  ActionIcon,
  Card,
  Flex,
  Table,
  Tooltip,
} from "@mantine/core";
import { useState } from "react";
import { ReportTable } from "@/components/ReportTable";
import { sampleDataCCTV } from "@/model/dataset";

const CameraView = () => {
  return (
    <Flex direction={"column"} gap={"xs"} p={"xs"} mah={"100vh"}>
        <MainView />
    </Flex>
  );
};

const MainView = () => {
  const stream = useStreamSocket();
  const [showTable, setShowTable] = useState(false);
  return (
    <>
      <Flex justify={"space-between"} w={"100%"}>
        <span className="flex flex-col">
          <h1 className="text-xl font-bold">Nama Camera</h1>
          <h3>Tanggal: 19 Februari 2024</h3>
        </span>
        <Card p={"xs"}>
          <ActionIcon.Group>
            <Tooltip label="Tampilan Kamera">
              <ActionIcon
                variant={showTable ? "default" : "filled"}
                size={"lg"}
                onClick={() => setShowTable(false)}
                aria-label="Camera"
              >
                <IconCamera size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Tampilan Tabel">
              <ActionIcon
                variant={showTable ? "filled" : "default"}
                size={"lg"}
                onClick={() => setShowTable(true)}
                aria-label="Table View"
              >
                <IconTable  size={20}  />
              </ActionIcon>
            </Tooltip>
          </ActionIcon.Group>
        </Card>
      </Flex>
      {showTable ? (
        <Table.ScrollContainer
          bd={"1px solid myColor.5"}
          className="w-full aspect-video"
        >
          <ReportTable data={sampleDataCCTV} />
        </Table.ScrollContainer>
      ) : (
        <ImageStreamViewer base64Data={stream.base64data} minW={500} />
      )}
      <br />
    </>
  );
};

export default CameraView;
