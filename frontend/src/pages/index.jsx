import { IoMdRefresh } from "react-icons/io";
import { ImageStreamViewer } from "../components/ImageStreamViewer";
import Title from "../components/titleDashboard";
import { useStreamSocket } from "../context/CameraSocketContext";
import { MdOutlinePlayCircle } from "react-icons/md";

const Home = () => {
  const stream = useStreamSocket();

  return (
    <div className="w-full p-4">
      <Title />
      <hr className="mt-2 border-2 border-[#66ABB1]" />
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
    <div className="flex flex-col p-4 gap-4">
      <div className="flex flex-col">
        <h1 className="font-bold text-xl">OPSI :</h1>
        <h1 className="font-semibold text-md">Tampilan Label Prediksi</h1>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">SOURCE :</h1>
          <button className="ml-2 focus:outline-none">
            <IoMdRefresh size={20} />
          </button>
        </div>
        <RtspInput/>
      </div>
    </div>
  );
};

const RtspInput = () => {
  return (
    <>
      <label htmlFor="cam-rtsp">RTSP URL</label>
      <div className="flex items-center border border-gray-400 rounded px-3 py-2">
        <input
          type="text"
          className="flex-1 focus:outline-none"
          placeholder="RTSP://localhost:8082/A301.live"
          id="cam-source-rtsp"
        />
        <button className="ml-2 focus:outline-none">
          <MdOutlinePlayCircle size={20} />
        </button>
      </div>
    </>
  );
};

export default Home;
