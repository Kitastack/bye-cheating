import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/sidebar";
import Title from "../components/titleDashboard";
import Flashphoner from "@flashphoner/websdk";
import { MdOutlinePlayCircle } from "react-icons/md";
import Swal from "sweetalert2";
import { IoMdRefresh } from "react-icons/io";
import useWebSocket from "react-use-websocket";
import { FaCirclePlay } from "react-icons/fa6";
import { PiVideoCameraFill } from "react-icons/pi";

const Home = () => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [RTSP_URL, setRTSPUrl] = useState("");
  const [newRTSPUrl, setNewRTSPUrl] = useState("");
  const [socketUrl] = useState("ws://localhost:7000/v1/test");
  const [, setStreamFailed] = useState(false);
  const { lastMessage } = useWebSocket(socketUrl);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const getBlobUrl = (data) => {
    try {
      return `data:image/jpeg;base64, ${data}`;
    } catch {
      return null;
    }
  };

  useEffect(() => {}, [lastMessage]);

  const toggleLabelVisibility = () => {
    setLabelVisible(!labelVisible);
  };

  const sessionRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const initApi = async () => {
      console.log("Inisialisasi Flashphoner API");
      await Flashphoner.init({});
      connect();
    };

    const connect = () => {
      if (!sessionRef.current) {
        sessionRef.current = Flashphoner.createSession({
          urlServer: "wss://demo.flashphoner.com",
        })
          .on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, (session) => {
            console.log("Koneksi WebSocket berhasil dibuat");
            if (videoPlaying) {
              playStream(session);
            }
          })
          .on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, (error) => {
            console.error("Koneksi WebSocket terputus:", error);
          })
          .on(Flashphoner.constants.SESSION_STATUS.FAILED, (error) => {
            console.error("Koneksi WebSocket gagal dibuat:", error);
          });
      }
    };

    const playStream = (session) => {
      if (streamRef.current) {
        streamRef.current.stop();
        streamRef.current = null;
      }

      streamRef.current = session
        .createStream({
          name: RTSP_URL,
          display: document.getElementById("play"),
        })
        .on(Flashphoner.constants.STREAM_STATUS.PLAYING, () => {
          console.log("Stream mulai diputar");
          setStreamFailed(false);
        })
        .on(Flashphoner.constants.STREAM_STATUS.STOPPED, () => {
          console.log("Stream dihentikan");
        })
        .on(Flashphoner.constants.STREAM_STATUS.FAILED, (error) => {
          console.error("Stream gagal diputar:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat memutar stream.",
          });
          setStreamFailed(true);
        })
        .play();
    };

    if (RTSP_URL && videoPlaying) {
      initApi();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.stop();
        streamRef.current = null;
      }

      if (sessionRef.current) {
        sessionRef.current.disconnect();
        sessionRef.current = null;
      }
    };
  }, [RTSP_URL, videoPlaying]);

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
    if (streamRef.current) {
      streamRef.current.stop();
      streamRef.current = null;
    }

    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }

    setTimeout(() => {
      setRTSPUrl((prevUrl) => {
        const newUrl = prevUrl.includes("?") ? prevUrl.split("?")[0] : prevUrl;
        return `${newUrl}?refresh=${Date.now()}`;
      });
    }, 500);
  };

  const startVideo = () => {
    Swal.fire({
      title: "Start Recording?",
      text: "Are you sure you want to start recording CCTV video?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, start recording!",
    }).then((result) => {
      if (result.isConfirmed) {
        setVideoPlaying(true); // Mengaktifkan pemutaran video
      }
    });
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
            <div className=" object-cover h-[600px] w-[75rem] border-4 border-solid rounded-lg flex place-content-center mt-5 px-10">
              <div id="play"></div>
              {(lastMessage?.data && (
                <img src={getBlobUrl(lastMessage?.data)} alt="CCTV Stream" />
              )) || (
                <h1 className="place-content-center text-2xl bg-slate-400 mx-auto my-auto px-7 py-2 rounded-lg bg-opacity-30">
                  Tidak Ada Video CCTV
                </h1>
              )}
            </div>
            <br />
            <div className="flex text-slate-700 items-center text-xl">
              <PiVideoCameraFill className="text-2xl" />
              <p className="ml-3">Mulai Merekam?</p>
            </div>
            <div className="flex items-center mt-3">
              <button
                className="flex  items-center bg-slate-700 px-5 py-2 text-xl font-semibold text-white mb-10 rounded-lg hover:bg-slate-800"
                onClick={startVideo}
              >
                <FaCirclePlay className="mr-3" />
                Mulai
              </button>
            </div>
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
                  value={newRTSPUrl}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
