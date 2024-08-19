import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import {
  default as CameraView,
  default as WebSocketDemo,
} from "@/pages/app/livecam";
import Laporan from "@/pages/app/report";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "./pages/register";
import { ErrorScreen } from "./components/ui/ErrorScreen";
import { Box, Button } from "@mantine/core";

function App() {
  const navigate = useNavigate();
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
          <Route
            path="*"
            element={
              <ErrorScreen
                text="404 Not Found"
                bottomSlot={
                  <Button
                    onClick={() => {
                      window.history?.length && window.history.length > 1
                        ? navigate(-1)
                        : navigate("/app");
                    }}
                    variant="subtle"
                  >
                    Back to previous page
                  </Button>
                }
              />
            }
          />
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <Box w={"100vw"} h={"100vh"}>
            <ErrorScreen
              text="404 Not Found"
              bottomSlot={
                <Button
                  onClick={() => navigate("/", { replace: true })}
                  variant="subtle"
                >
                  back to home
                </Button>
              }
            />
          </Box>
        }
      />
    </Routes>
  );
}

export default App;
