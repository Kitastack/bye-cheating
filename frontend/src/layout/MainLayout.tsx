import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}