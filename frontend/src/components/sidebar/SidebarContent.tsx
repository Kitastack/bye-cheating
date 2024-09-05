import { Divider, NavLink } from "@mantine/core";
import { useState } from "react";
import { IconDeviceDesktop, IconUsers } from "@tabler/icons-react";
import { UserCardInfo } from "./UserInfo";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const menuLists = [
  {
    title: "Livecam",
    path: "/app",
    icon: <IconDeviceDesktop size={20} />,
  },
  {
    title: "Pengguna",
    path: "/app/users",
    icon: <IconUsers size={20} />,
  },
];

// function TitleSidebar() {
//   return (
//     <div className="flex min-h-6 items-center justify-center p-4">
//       <img
//         src="/LogoBgWhite.png"
//         className={`float-left block h-12 w-12 duration-500`}
//       />
//       <div className="p-1" />
//       <Text variant="text">Dashboard</Text>
//     </div>
//   );
// }

export default function SidebarContent() {
  const navigate = useNavigate();
  const router = useRouterState()
  const [active, setActive] = useState(
    menuLists.findIndex((item) => item.path == (location.pathname ?? "/app"))
  );

  return (
    <>
      <UserCardInfo active={router.location.pathname == "/app/profile"} onClick={()=> navigate({to: "/app/profile"})} />
      <Divider my={""} />
      {menuLists.map((val, idx) => (
        <NavLink
          variant="filled"
          key={val.title}
          component={"button"}
          label={val.title}
          leftSection={val.icon}
          active={val.path == router.location.pathname}
          onClick={() => {
            navigate({to: val.path});
            setActive(idx);
          }}
        />
      ))}
    </>
  );
}
