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
    <div className="flex font-primary">
      <div className="fixed z-50">
        <Sidebar />
      </div>
      <div className="w-full container mx-auto ml-28">
        <Title />
        <hr style={{ border: "1px solid #66ABB1" }} className="mt-2 " />
        <div className="flex">
          <div className="flex-[74%] mt-2 text-center">
            <h1 className="text-xl font-bold">KAMERA CCTV RUANG A301 (TEST)</h1>
            <h3>Tanggal: 19 Februari 2024</h3>
            <div className="mt-5 pr-10">
              <img
                src="image:"
                className="min-h-[400px] min-w-[600px] bg-black"
              />
            </div>
            <br />
          </div>
          <div className="border-l border-[#66ABB1] h-[40rem]"></div>
          <Inspector />
        </div>
      </div>
    </div>
  );
};

export {HomeDev};
