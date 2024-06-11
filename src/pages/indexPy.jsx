import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import Title from "../components/titleDashboard";
import Swal from "sweetalert2";
import { IoMdRefresh } from "react-icons/io";
import { MdOutlinePlayCircle } from "react-icons/md";

const Home = () => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [RTSP_URL, setRTSPUrl] = useState(
    "rtsp://rtspstream:2c40947ac6aba92b217cdec98ca3126a@zephyr.rtsp.stream/movie"
  );
  const [newRTSPUrl, setNewRTSPUrl] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    // Tidak perlu memulai pemutaran video secara otomatis
  }, []);

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
        // Set RTSP URL baru
        setRTSPUrl(newRTSPUrl);
      }
    });
  };

  const handleRefresh = () => {
    // Fungsi ini akan mengirim permintaan ke server backend untuk menyegarkan RTSP URL
    fetch("http://localhost:5000/set_rtsp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: RTSP_URL }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "RTSP URL updated") {
          Swal.fire({
            title: "Success!",
            text: "RTSP URL has been refreshed.",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.error("Error refreshing RTSP URL:", error);
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
            <div className="mt-5 pr-10">
              <video
                id="video"
                ref={videoRef}
                className="w-full h-full border-4 mx-auto border-solid rounded-lg flex place-content-center"
                controls
                autoPlay
                src={RTSP_URL}
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
                onClick={() => setLabelVisible(!labelVisible)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
