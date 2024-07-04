import { useContext } from "react";
import Title from "../components/titleDashboard";
import { Inspector } from "../components/inspector";
import { ImageStreamViewer } from "../components/ImageStreamViewer";
import { StreamSocketContext } from "../context/CameraSocketContext";

const Home = () => {
  const stream = useContext(StreamSocketContext);

  return (
    <div className="w-full p-4">
      <Title />
      <hr style={{ border: "1px solid #66ABB1" }} className="mt-2 " />
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

export default Home;
