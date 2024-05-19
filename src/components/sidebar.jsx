import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropleft } from "react-icons/io";
import { MdMonitor } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineVideoLabel } from "react-icons/md";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const Menus = [
    { title: "Tampilan Langsung", path: "/" },
    {
      title: "Laporan",
      path: "/laporan",
      icon: <HiClipboardDocumentList />,
    },
    {
      title: "Label",
      path: "/label",
      icon: <MdOutlineVideoLabel />,
    },
  ];

  return (
    <>
      <div
        className={`bg-[#2C353C] h-screen fixed left-0 py-5 pt-8 font-poppins ${
          open ? "w-72" : "w-20"
        } duration-300 relative`}
      >
        {/* Title */}
        <IoMdArrowDropleft
          className={`bg-transparent right-5 text-white text-3xl rounded-full absolute top-11 cursor-pointer ${
            !open && "rotate-180 right-8"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex px-5">
          <img
            src="/LogoBgWhite.png"
            className={`w-12 h-12 cursor-pointer block float-left mr-3 duration-500 ${
              !open && "hidden"
            }`}
          />
          <h1
            className={`text-white text-2xl origin-left font-bold duration-500 mt-2 ${
              !open && "hidden"
            }`}
          >
            Dashborad
          </h1>
        </div>

        {/* Sub Menu */}
        <ul className="pt-10">
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`text-white flex items-center gap-x-4 cursor-pointer p-3 ${
                location.pathname === menu.path
                  ? "bg-[#F59024] text-white"
                  : "hover:bg-[#F59024] hover:text-white"
              } px-5 ${menu.spacing ? "mt-9" : "mt-2"}`}
              onClick={() => navigate(menu.path)}
            >
              <span className="text-2xl block float-left">
                {menu.icon ? menu.icon : <MdMonitor />}
              </span>
              <span
                className={`text-lg font-medium flex-1 ${!open && "hidden"}`}
              >
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
