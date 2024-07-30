import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import {
  default as CameraView,
  default as WebSocketDemo,
} from "@/pages/app/livecam";
import Laporan from "@/pages/app/report";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "./pages/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="app" element={<MainLayout />}>
          <Route index element={<CameraView />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="websoket" element={<WebSocketDemo />} />
          <Route path="test" element={<div>test view</div>} />
          <Route path="*" element={<div>404 not found</div>} />
        </Route>
      </Route>
      <Route path="*" element={<div>404 not found</div>} />
    </Routes>
  );
}

export default App;
