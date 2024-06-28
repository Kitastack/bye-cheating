import { MdOutlinePlayCircle } from "react-icons/md";
import Sidebar from "../components/sidebar";
import Title from "../components/titleDashboard";
import { useContext } from "react";
import { ChannelContext, IChannelContext } from "../context/ChannelContext";
import { IoMdRefresh } from "react-icons/io";
import { Inspector } from "../components/inspector";

const HomeDev = () => {
  const { camList } = useContext(ChannelContext) as IChannelContext;

  return (
      <div className="w-full p-4">
        <Title />
        <hr style={{ border: "1px solid #66ABB1" }} className="mt-2" />
        <div className="flex">
          <div className="mt-2 flex-[74%] text-center">
            <h1 className="text-xl font-bold">KAMERA CCTV RUANG A301 (TEST)</h1>
            <h3>Tanggal: 19 Februari 2024</h3>
            <div className="flex items-center justify-center">
              <img
            
                src="image:"
                className="min-h-[400px] max-w-[600px] bg-black aspect-video"
              />
            </div>
            <br />
          </div>
          <div className="h-[40rem] border-l border-[#66ABB1]"></div>
          <Inspector />
        </div>
      </div>
  );
};

export { HomeDev };
