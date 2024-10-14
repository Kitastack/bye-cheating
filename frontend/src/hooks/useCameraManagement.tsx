import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useAuthManager } from "./useAuthManager";
import { BASE_URL } from "@/constant";

interface CameraProps {
  streamId: string;
  reportId: string;
  id: string;
  title: string;
  description: string;
}

export const useCameraManagement = () => {
  const [cameras, setCameras] = useState<CameraProps[]>([]);
  const { getAccessToken } = useAuthManager();
  async function syncCameras() {
    const response = await fetch(`${BASE_URL}/report?stream=True`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      method: "GET",
    });
    try {
      const data = await response.json();
      const lists = data.result;
      const cameras: CameraProps[] = lists.map((list: any) => {
        return {
          title: list.title,
          description: list.description,
          id: list.id,
          streamId: list.streamId,
          reportId: list.reportId,
        } as CameraProps;
      });
      setCameras(cameras);
      return;
    } catch (e) {
      console.error(e);
    }
  }

  function addCamera(title: string, id: string) {
    //check if name and url is not empty
    // if (!title || !id) {
    //   notifications.show({
    //     title: "Error",
    //     message: "Name and URL cannot be empty",
    //     color: "red",
    //   });
    //   return;
    // }
    // //check if camera already exists
    // if (cameras.some((cam) => cam.title === title)) {
    //   notifications.show({
    //     title: "Error",
    //     message: "Camera with the same name already exists",
    //     color: "red",
    //   });
    //   return;
    // }

    // setCameras([...cameras, { title, id, description: "", streamId: "" }]);
    // notifications.show({ title: "Camera added", message: title });
    notifications.show({
      title: "Error",
      message: "This feature is not implemented yet",
      color: "red",
    });
  }
  function removeCamera(id: string) {
    // const removedCameras = cameras.filter((cam) => cam.id === id);
    // if (removedCameras.length === 0) {
    //   notifications.show({
    //     title: "Error",
    //     message: "Camera not found",
    //     color: "red",
    //   });
    //   return;
    // }
    // setCameras(cameras.filter((cam) => cam.id !== id));
    // notifications.show({ title: "Camera removed", message: id });
    notifications.show({
      title: "Error",
      message: "This feature is not implemented yet",
      color: "red",
    });
  }

  return { cameras, addCamera, removeCamera, syncCameras };
};
