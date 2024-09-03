import { useLocation, useNavigate } from "react-router-dom";
import { Divider, NavLink } from "@mantine/core";
import { useState } from "react";
import { IconDeviceDesktop, IconBook2, IconLogout } from "@tabler/icons-react";
import { UserCardInfo } from "./UserInfo";

const menuLists = [
  {
    title: "Tampilan Langsung",
    path: "/app",
    icon: <IconDeviceDesktop size={20} />,
  },
  {
    title: "Laporan",
    path: "/app/laporan",
    icon: <IconBook2 size={20} />,
  },
];

// function TitleSidebar() {
//   return (
//     <div className="flex min-h-6 items-center justify-center p-4">
//       <img
//         src="/LogoBgWhite.png"
//         className={`float-left block h-12 w-12 duration-500 ${
//           !open && "hidden"
//         }`}
//       />
//       <div className="p-1" />
//       <Text variant="text">Dashboard</Text>
//     </div>
//   );
// }

export default function SidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(
    menuLists.findIndex((item) => item.path == (location.pathname ?? "/app"))
  );

  return (
    <>
      <UserCardInfo />
      <Divider my={""} />
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
        leftSection={<IconLogout size={20} />}
        onClick={() => {
          console.log("logout");
        }}
      />
    </>
  );
}
