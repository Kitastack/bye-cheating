/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useContext } from "react";
import Sidebar from "../components/sidebar";
import Title from "../components/titleDashboard";
import Hls from "hls.js";
import Swal from "sweetalert2";
import { IoMdRefresh } from "react-icons/io";
import { MdOutlinePlayCircle } from "react-icons/md";
import { ChannelContext, IChannelContext } from "../context/ChannelContext";

const Home = () => {
  const {camList} = useContext(ChannelContext) as IChannelContext

  
  const [labelVisible, setLabelVisible] = useState(false);
  const [RTSP_URL, setRTSPUrl] = useState(
    "rtsp://admin:%40psti2012@192.168.145.2/Streaming/Channels/1"
  );
  const [newRTSPUrl, setNewRTSPUrl] = useState("");
  const [HLS_URL, setHLSUrl] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleLabelVisibility = () => {
    setLabelVisible(!labelVisible);
  };

  const clearCache = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.load();
    }
    console.log("Cache cleared");
  };

  const initApi = () => {
    clearCache();
    console.log("Inisialisasi HLS stream");
    setHLSUrl(`http://127.0.0.1:8080/stream.m3u8`);
  };

  const playStream = () => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HLS_URL);
      hls.attachMedia(videoRef.current!!);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play();
      });
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = HLS_URL;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current?.play();
      });
    }
  };

  useEffect(() => {
    if (HLS_URL) {
      playStream();
    }
  }, [HLS_URL]);

  useEffect(() => {
    if (RTSP_URL) {
      setTimeout(initApi, 1000);
    }
    return () => {
      clearCache();
    };
  }, [RTSP_URL]);

  const handleRTSPUrlChange = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to use this RTSP URL?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, use it!",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCache();
        setRTSPUrl(newRTSPUrl);
        Swal.fire({
          title: "Success!",
          text: "Your RTSP URL has been updated.",
          icon: "success",
        });
      }
    });
  };

  const handleRefresh = () => {
    console.log("Refreshing...");
    clearCache();
    setTimeout(() => {
      setRTSPUrl((prevUrl) => {
        const newUrl = prevUrl.includes("?") ? prevUrl.split("?")[0] : prevUrl;
        return `${newUrl}?refresh=${Date.now()}`;
      });
    }, 500);
  };

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
            <h1 className="text-xl font-bold">KAMERA CCTV RUANG A301</h1>
            <h3>Tanggal: 19 Februari 2024</h3>
            <div className="mt-5 pr-10">
              <video
                id="play"
                ref={videoRef}
                className="w-full h-full border-4 mx-auto border-solid rounded-lg flex place-content-center"
                controls
              ></video>
            </div>
            <br />
          </div>
          <div className="border-l border-[#66ABB1] h-[40rem]"></div>
          <div>
            <div className="flex-[45%] mx-5 mt-2">
              <h1 className="font-bold text-xl">OPSI :</h1>
              <h1 className="font-semibold text-md">Tampilan Label Prediksi</h1>
              <button
                onClick={toggleLabelVisibility}
                className={`px-4 py-2 rounded-md mt-2 ${
                  labelVisible ? "bg-[#F59024]" : "bg-[#2C353C]"
                } text-white`}
              >
                {labelVisible ? "Tampilkan" : "Sembunyikan"}
              </button>
            </div>
            <div className="flex-[40%] mx-5 mt-10">
              <div className="flex items-center">
                <h1 className="font-bold text-xl">SOURCE :</h1>
                <button
                  className="ml-2 focus:outline-none"
                  onClick={handleRefresh}
                >
                  <IoMdRefresh size={20} />
                </button>
              </div>
              <h1 className="font-semibold text-sm">
                CAMERA SOURCE URL (RTSP)
              </h1>
              <div className="flex items-center border border-gray-400 rounded px-3 py-2">
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="RTSP://localhost:8082/A301.live"
                  onChange={(e) => setNewRTSPUrl(e.target.value)}
                />
                <button
                  className="ml-2 focus:outline-none"
                  onClick={handleRTSPUrlChange}
                >
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

              <h1 className="font-semibold text-sm mt-5">
                LABEL SOURCE (WEBSOCKET)
              </h1>
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
        </div>
      </div>
    </div>
  );
};

export default Home;
