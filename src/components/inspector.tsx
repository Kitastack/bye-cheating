import { IoMdRefresh } from "react-icons/io";
import { MdOutlinePlayCircle } from "react-icons/md";

const Inspector = () => {
  return (
    <div>
      <div className="flex-[45%] mx-5 mt-2">
        <h1 className="font-bold text-xl">OPSI :</h1>
        <h1 className="font-semibold text-md">Tampilan Label Prediksi</h1>
      </div>
      <div className="flex-[40%] mx-5 mt-10">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">SOURCE :</h1>
          <button className="ml-2 focus:outline-none">
            <IoMdRefresh size={20} />
          </button>
        </div>
        <h1 className="font-semibold text-sm">CAMERA SOURCE URL (RTSP)</h1>
        <div className="flex items-center border border-gray-400 rounded px-3 py-2">
          <input
            type="text"
            className="flex-1 focus:outline-none"
            placeholder="RTSP://localhost:8082/A301.live"
          />
          <button className="ml-2 focus:outline-none">
            <MdOutlinePlayCircle size={20} />
          </button>
        </div>

        <h1 className="font-semibold text-sm mt-5">
          CAMERA WITH LABELED SOURCE (RTSP)
        </h1>
        <div className="flex items-center border border-gray-400 rounded px-3 py-2">
          <input
            type="text"
            className="flex-1 focus:outline-none"
            placeholder="RTSP://localhost:8082/A301-label.live"
          />
          <button className="ml-2 focus:outline-none">
            <MdOutlinePlayCircle size={20} />
          </button>
        </div>

        <h1 className="font-semibold text-sm mt-5">LABEL SOURCE (WEBSOCKET)</h1>
        <div className="flex items-center border border-gray-400 rounded px-3 py-2">
          <input
            type="text"
            className="flex-1 focus:outline-none"
            placeholder="WS://localhost:8082/ws"
          />
          <button className="ml-2 focus:outline-none">
            <MdOutlinePlayCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export {Inspector}