import { useLocation, useNavigate } from "react-router-dom";
import { MdMonitor } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { NavLink, Text } from "@mantine/core";
import { useState } from "react";
import { HiLogout } from "react-icons/hi";

const menuLists = [
  { title: "Tampilan Langsung", path: "/app", icon: <MdMonitor /> },
  {
    title: "Laporan",
    path: "/app/laporan",
    icon: <HiClipboardDocumentList />,
  },
];

function TitleSidebar() {
  return (
    <div className="flex min-h-6 items-center justify-center p-4">
      <img
        src="/LogoBgWhite.png"
        className={`float-left block h-12 w-12 duration-500 ${
          !open && "hidden"
        }`}
      />
      <div className="p-1" />
      <Text variant="text">Dashboard</Text>
    </div>
  );
}

export default function NavbarContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(
    menuLists.findIndex((item) => item.path == (location.pathname ?? "/app"))
  );

  return (
    <>
      <TitleSidebar />
      {menuLists.map((val, idx) => (
        <NavLink
          variant="filled"
          key={val.title}
          component={"button"}
          label={val.title}
          leftSection={val.icon}
          active={active == idx}
          onClick={() => {
            navigate(val.path);
            setActive(idx);
          }}
        />
      ))}
      <NavLink
        key={"logout"}
        variant="subtle"
        component="button"
        label={"Log out"}
        color="red"
        leftSection={<HiLogout />}
        onClick={() => {
          console.log("logout");
        }}
      />
    </>
  );
}
