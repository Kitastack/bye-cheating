import Home from "./pages/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Laporan from "./pages/laporan";
import Label from "./pages/label";
import { HomeDev } from "./pages/indexDev";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeDev />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="label" element={<Label />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
