import { ImageStreamViewer } from "../../components/ImageStreamViewer";
import { useStreamSocket } from "../../context/CameraSocketContext";
import {
  MdCamera,
  MdOutlinePlayArrow,
  MdTableView,
} from "react-icons/md";
import { ActionIcon, Table, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { ReportTable } from "@/components/ReportTable";
import { sampleDataCCTV } from "@/model/dataset";

const CameraView = () => {
  const stream = useStreamSocket();
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="flex flex-grow p-4">
      <div className="flex flex-grow">
        <div className="flex-grow flex flex-col items-start">
          <span className="flex w-full justify-between pr-4">
            <span className="flex flex-col">
              <h1 className="text-xl font-bold">Nama Camera</h1>
              <h3>Tanggal: 19 Februari 2024</h3>
            </span>
            <ActionIcon.Group>
              <ActionIcon variant="default" size={"lg"} onClick={()=> setShowTable(false)} aria-label="Camera">
                <MdCamera />
              </ActionIcon>
              <ActionIcon variant="default" size={"lg"} onClick={()=> setShowTable(true)} aria-label="Table View">
                <MdTableView />
              </ActionIcon>
            </ActionIcon.Group>
          </span>
          {showTable ? (
            <Table.ScrollContainer className="border-[1px] aspect-video" w={640}>
              <ReportTable data={sampleDataCCTV} />
            </Table.ScrollContainer>
          ) : (
            <ImageStreamViewer base64Data={stream.base64data} w={640} />
          )}
          <br />
        </div>
        <div className="border-l border-gray-300 min-h-full"></div>
        <Inspector />
      </div>
    </div>
  );
};

const Inspector = () => {
  return (
    <div className="flex flex-col p-2 gap-2">
      <Text size="xl">Pengaturan</Text>
      <RtspInput />
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
            <MdOutlinePlayArrow />
          </ActionIcon>
        }
      />
    </>
  );
};

export default CameraView;
