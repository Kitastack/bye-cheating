import { ImageStreamViewer } from "../components/ImageStreamViewer";
import { useStreamSocket } from "../context/CameraSocketContext";
import { MdOutlinePlayArrow } from "react-icons/md";
import { ActionIcon, Text, TextInput } from "@mantine/core";

const CameraView = () => {
  const stream = useStreamSocket();

  return (
    <div className="w-full p-4">
      <div className="flex">
        <div className="flex-grow flex flex-col items-center">
          <h1 className="text-xl font-bold">KAMERA CCTV RUANG A301</h1>
          <h3>Tanggal: 19 Februari 2024</h3>
          <ImageStreamViewer base64Data={stream.base64data} />
          <br />
        </div>
        <div className="border-l border-[#66ABB1] h-[40rem]"></div>
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
          <ActionIcon variant="gradient">
            <MdOutlinePlayArrow />
          </ActionIcon>
        }
      />
    </>
  );
};

export default CameraView;
