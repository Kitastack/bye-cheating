import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useAuthManager } from "./useAuthManager";
import { BASE_URL } from "@/constant";

interface StreamProps {
  id: string;
  url: string;
  userId: string;
  updatedDate: string;
  createdDate: string;
  streamId: string;
}

export const useCameraManagement = () => {
  const [cameras, setCameras] = useState<StreamProps[]>([]);
  const { getAccessToken, refreshToken } = useAuthManager();

  async function addCamera(streamUrl: string) {
    if (!streamUrl || streamUrl.trim() === "") {
      notifications.show({
        title: "Error",
        message: "Stream URL cannot be empty",
        color: "red",
      });
      return;
    }
    const response = await fetch(`${BASE_URL}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        url: streamUrl,
      }),
    }).catch((error) => {
      console.error("Failed to add camera", error);
    });
    if (!response) {
      return;
    }

    if (!response.ok) {
      if (response.body) {
        const errorData = await response.json();
        notifications.show({
          title: "Error",
          message: errorData.message || "Failed to add camera",
          color: "red",
        });
        console.error("Failed to add camera", errorData);
        return;
      }
      notifications.show({
        title: "Error",
        message: "Failed to add camera",
        color: "red",
      });
      console.error("Failed to add camera", response.statusText);
      return;
    }
    const data = await response.json();
    if (data && data.result) {
      const newCamera: StreamProps = {
        id: data.result.id,
        streamId: data.result.streamId,
        url: data.result.url,
        userId: data.result.userId,
        updatedDate: data.result.updatedDate,
        createdDate: data.result.createdDate ?? new Date().toISOString(),
      };
      setCameras((prev) => [...prev, newCamera]);
      notifications.show({
        title: "Camera added",
        message: `Camera ${newCamera.id} added successfully`,
        color: "green",
      });
    }
  }
  async function editStream(id: string, newUrl: string) {
    if (!id || !newUrl || newUrl.trim() === "") {
      notifications.show({
        title: "Error",
        message: "Stream ID and URL cannot be empty",
        color: "red",
      });
      return;
    }
    const response = await fetch(`${BASE_URL}/stream`, {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        url: newUrl,
      }),
    }).catch((error) => {
      console.error("Failed to edit camera", error);
    });
    if (!response) {
      return;
    }

    if (!response.ok) {
      if (response.body) {
        const errorData = await response.json();
        notifications.show({
          title: "Error",
          message: errorData.message || "Failed to edit camera",
          color: "red",
        });
        console.error("Failed to edit camera", errorData);
        return;
      }
      notifications.show({
        title: "Error",
        message: "Failed to edit camera",
        color: "red",
      });
      console.error("Failed to edit camera", response.statusText);
      return;
    }
    const data = await response.json();
    if (data && data.result) {
      const updatedCamera: StreamProps = {
        id: data.result.id,
        streamId: data.result.streamId,
        url: data.result.url,
        userId: data.result.userId,
        updatedDate: data.result.updatedDate,
        createdDate: data.result.createdDate ?? new Date().toISOString(),
      };
      setCameras((prev) =>
        prev.map((camera) => (camera.id === id ? updatedCamera : camera))
      );
      notifications.show({
        title: "Camera updated",
        message: `Camera ${updatedCamera.id} updated successfully`,
        color: "green",
      });
    }
  }

  // Fetch cameras from the server
  // the body result should be in the format:
  // {
  //   "result": [] with StreamProps[]
  // }
  async function fetchCameras() {
    await refreshToken();
    const token = await getAccessToken();
    console.log("Fetching cameras with token:", token);
    if (!token) {
      notifications.show({
        title: "Error",
        message: "You are not authenticated",
        color: "red",
      });
      return;
    }
    const response = await fetch(`${BASE_URL}/stream`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    }).catch((error) => {
      console.error("Failed to fetch cameras", error);
    });
    if (!response) {
      return;
    }
    if (!response.ok) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch cameras",
        color: "red",
      });
      console.error("Failed to fetch cameras", response.statusText);
      return;
    }

    const data = await response.json();
    if (data && data.result) {
      //set items as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fetchedCameras: StreamProps[] = data.result.map((item: any) => ({
        id: item.id,
        streamId: item.streamId,
        url: item.url,
        userId: item.userId,
        updatedDate: item.updatedDate,
        createdDate: item.createdDate ?? new Date().toISOString(),
      }));
      setCameras(fetchedCameras);
    }
  }

  return { cameras, addCamera, editStream, fetchCameras };
};
