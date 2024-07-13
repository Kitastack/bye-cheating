import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { default as Home, default as WebSocketDemo } from "./pages/index";
import Laporan from "./pages/laporan";
import { LoginPage } from "./pages/login";
import { AuthProvider } from "./context/AuthContext";
import { StreamSocketProvider } from "./context/CameraSocketContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <StreamSocketProvider>
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route index element={<LoginPage />} />
              <Route path="app" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="laporan" element={<Laporan />} />
                <Route path="websoket" element={<WebSocketDemo />} />
              </Route>
            </Route>
          </Routes>
        </StreamSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
