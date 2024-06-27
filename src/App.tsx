import Home from "./pages/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Laporan from "./pages/laporan";
import Label from "./pages/label";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/label" element={<Label />} />
      </Routes>
    </Router>
  );
}

export default App;
