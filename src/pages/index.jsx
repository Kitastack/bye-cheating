import Sidebar from "../components/sidebar";
import Title from "../components/titleDashboard";

export default function Home() {
  return (
    <>
      <div className="flex font-primary">
        <Sidebar />
        <div className="w-full container mx-auto">
          <Title />
          <hr style={{ border: "1px solid #66ABB1" }} className="mt-2 " />
          <div className="flex ">
            <div className="flex-[59%] mt-2 text-center">
              <h1 className="text-xl font-bold">KAMERA CCTV RUANG A301</h1>
              <h3>Tanggal: 19 Februari 2024</h3>
            </div>
            <div className=" border-l border-[#66ABB1] h-[43rem]"></div>
            <div className="flex-[%40] mx-5 mt-2">
              <h1 className="font-semibold text-md">
                Tampilan Label Prediksi:
              </h1>
              <label className="inline-flex items-center mr-2 my-2 rounded-md cursor-pointer text-sm text-white">
                <input type="checkbox" className="hidden peer" />
                <span className="px-4 py-2 rounded-l-md bg-[#2C353C] peer-checked:dark:bg-[#F59024]">
                  Tampilkan
                </span>
                <span className="px-4 py-2 rounded-r-md bg-[#F59024] peer-checked:dark:bg-[#2C353C]">
                  Sembunyikan
                </span>
              </label>
              <h1 className="font-semibold text-md mt-5">Resolusi:</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
