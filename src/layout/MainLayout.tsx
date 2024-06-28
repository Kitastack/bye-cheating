import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
