import Home from "./pages/index";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Laporan from "./pages/laporan";
import WebSocketDemo from "./pages/index";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Outlet />}>
        
          <Route path="app" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="laporan" element={<Laporan />} />
            <Route path="websoket" element={<WebSocketDemo />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
