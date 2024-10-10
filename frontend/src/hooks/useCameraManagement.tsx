import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface CameraProps {
  name: string;
  url: string;
}

export const useCameraManagement = () => {
  const [cameras, setCameras] = useState<CameraProps[]>([]);

  function addCamera(name: string, url: string) {
    //check if name and url is not empty
    if (!name || !url) {
      notifications.show({
        title: "Error",
        message: "Name and URL cannot be empty",
        color: "red",
      });
      return;
    }
    //check if camera already exists
    if (cameras.some((cam) => cam.name === name)) {
      notifications.show({
        title: "Error",
        message: "Camera with the same name already exists",
        color: "red",
      });
      return
    }

    setCameras([...cameras, { name, url }]);
    notifications.show({ title: "Camera added", message: name });
  }
  function removeCamera(url: string) {
    const removedCameras = cameras.filter((cam) => cam.url === url);
    if (removedCameras.length === 0) {
      notifications.show({
        title: "Error",
        message: "Camera not found",
        color: "red",
      });
      return;
    }
    setCameras(cameras.filter((cam) => cam.url !== url));
    notifications.show({ title: "Camera removed", message: url });
  }

  return { cameras, addCamera, removeCamera };
};
