import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/sidebar";
import Title from "../components/titleDashboard";
import Flashphoner from "@flashphoner/websdk";
import { MdOutlinePlayCircle } from "react-icons/md";
import Swal from "sweetalert2";

const Home = () => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [RTSP_URL, setRTSPUrl] = useState("rtsp://localhost:8082/A301.live");
  const [newRTSPUrl, setNewRTSPUrl] = useState("");

  const toggleLabelVisibility = () => {
    setLabelVisible(!labelVisible);
  };

  const sessionRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const initApi = () => {
      console.log("Inisialisasi Flashphoner API");
      Flashphoner.init({});
      connect();
    };

    const connect = () => {
      console.log("Menghubungkan ke server");
      if (!sessionRef.current) {
        sessionRef.current = Flashphoner.createSession({
          urlServer: "wss://demo.flashphoner.com",
        })
          .on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, (session) => {
            console.log("Koneksi WebSocket berhasil dibuat");
            playStream(session);
          })
          .on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, () => {
            console.log("Koneksi WebSocket terputus");
          })
          .on(Flashphoner.constants.SESSION_STATUS.FAILED, () => {
            console.log("Koneksi WebSocket gagal dibuat");
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
        })
        .on(Flashphoner.constants.STREAM_STATUS.STOPPED, () => {
          console.log("Stream dihentikan");
        })
        .play();
    };

    if (RTSP_URL) {
      setTimeout(initApi, 1000);
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
        setRTSPUrl(newRTSPUrl);
        Swal.fire({
          title: "Success!",
          text: "Your RTSP URL has been updated.",
          icon: "success",
        });
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
            <div className=" mt-5 pr-10">
              <div
                id="play"
                className="w-full h-full border-4 mx-auto border-solid rounded-lg flex place-content-center"
              ></div>
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
              <h1 className="font-bold text-xl">SOURCE :</h1>

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
