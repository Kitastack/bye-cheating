import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropleft } from "react-icons/io";
import { MdMonitor } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineVideoLabel } from "react-icons/md";

function TitleSidebar() {
  return (
    <div className="flex min-h-6 items-center justify-center p-5">
      <img
        src="/LogoBgWhite.png"
        className={`float-left block h-12 w-12 cursor-pointer duration-500 ${
          !open && "hidden"
        }`}
      />
      <div className="p-1" />
      <h1
        className={`text-2xl font-bold text-white duration-500 ${
          !open && `hidden`
        } `}
      >
        Dashboard
      </h1>
    </div>
  );
}

function SubMenu({
  title,
  icon,
  isActive,
  onClick,
  isExpanded,
}: {
  title: string;
  icon: JSX.Element;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const mainColor = isActive
    ? "bg-[#F59024] text-white"
    : "hover:bg-[#F59024] hover:text-white";

  return (
    <li
      className={`flex cursor-pointer items-center w-auto p-4 text-white ${mainColor}`}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className={`font-poppins flex-1 overflow-hidden text-lg font-medium transition-all ${
          isExpanded ? "w-fit" : "w-0"
        }`}
      >
        {title}
      </span>
    </li>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const Menus = [
    { title: "Tampilan Langsung", path: "/", icon: <MdMonitor /> },
    {
      title: "Laporan",
      path: "/laporan",
      icon: <HiClipboardDocumentList />,
    },
  ];

  return (
    <>
      <div
        className={`font-poppins min-w-28 left-0 flex h-screen flex-col items-center bg-[#2C353C] duration-200`}
      >
        {/* <IoMdArrowDropleft
          className={`cursor-pointer rounded-full bg-transparent text-3xl text-white ${
            !open && "right-8 rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        /> */}
        <TitleSidebar />

        {/* Sub Menu */}
        <ul className="pt-10">
          {Menus.map((menu, index) => (
            <SubMenu
              key={index}
              icon={menu.icon}
              isActive={menu.path == location.pathname}
              onClick={() => navigate(menu.path)}
              title={menu.title}
              isExpanded={open}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
