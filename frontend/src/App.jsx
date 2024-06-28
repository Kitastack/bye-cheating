import Home from "./pages/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Laporan from "./pages/laporan";
import WebSocketDemo from "./pages/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/websoket" element={<WebSocketDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
