import { useEffect, useState} from "react";
import Title from "../components/titleDashboard";
import useWebSocket from "react-use-websocket";
import { Inspector } from "../components/inspector";
import { ImageStreamViewer } from "../components/ImageStreamViewer";

const Home = () => {
  const [socketUrl] = useState("ws://localhost:7000/v1/test");
  const { lastMessage } = useWebSocket(socketUrl);



  useEffect(() => {}, [lastMessage]);

  return (
    <div className="w-full p-4">
      <Title />
      <hr style={{ border: "1px solid #66ABB1" }} className="mt-2 " />
      <div className="flex">
        <div className="flex-[74%] mt-2 text-center">
          <h1 className="text-xl font-bold">KAMERA CCTV RUANG A301</h1>
          <h3>Tanggal: 19 Februari 2024</h3>
         <ImageStreamViewer socketEvent={lastMessage} />
          <br />      
        </div>
        <div className="border-l border-[#66ABB1] h-[40rem]"></div>
        <Inspector />
      </div>
    </div>
  );
};

export default Home;
