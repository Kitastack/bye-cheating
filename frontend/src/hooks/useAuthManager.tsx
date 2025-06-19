import { BASE_URL } from "@/constant";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const useAuthManager = () => {
  const navigate = useNavigate();

  async function logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    notifications.show({
      title: "Logout successful",
      message: "Goodbye",
      color: "green",
    });
    navigate({ to: "/login", replace: true });
  }
  async function getAccessToken() {
    const data = localStorage.getItem(ACCESS_TOKEN);
    if (!data) {
      console.error("No access token found");
      return null;
    }
    return data;
  }

  async function refreshToken() {
    // refresh token if the access token is expired
    const response = await fetch(`${BASE_URL}/user/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem(REFRESH_TOKEN),
      }),
    }).catch((e) => console.error("Error refreshing token", e));
    if (!response) {
      return;
    }
    if (!response.ok) {
      notifications.show({
        title: "Refresh token failed",
        message: "Please login again",
        color: "red",
      });
      console.error("Refresh token failed", response.statusText);
      navigate({ to: "/login", replace: true });
      return;
    }
    const data = await response.json();
    if (data && data.result && data.result.token) {
      localStorage.setItem(ACCESS_TOKEN, data.result.token);
      
    }
  }

  async function submitLogin(email: string, password: string) {
    const body = {
      email: email,
      password: password,
    };

    const response = await fetch(`${BASE_URL}/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch((error) => {
      console.error("Failed to login", error);
      notifications.show({
        title: "Login failed",
        message: "Please check your network connection",
        color: "red",
      });
      return null;
    });
    if (!response) {
      return;
    }

    // error check first
    if (!response.ok) {
      // chekck if body message is available
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        notifications.show({
          title: "Login failed",
          message: errorBody.message,
          color: "red",
        });
        console.error("Login failed", errorBody.message);
        return;
      }
      notifications.show({
        title: "Login failed",
        message: "Please check your credentials",
        color: "red",
      });
      console.error("Login failed", response.statusText);
      return;
    }

    const data = await response.json();
    localStorage.setItem(ACCESS_TOKEN, data.result.accessToken);
    localStorage.setItem(REFRESH_TOKEN, data.result.refreshToken);
    notifications.show({
      title: "Login successful",
      message: "Welcome back",
      color: "green",
    });
    navigate({ to: "/app", replace: true });
  }
  return { submitLogin, logout, getAccessToken, refreshToken };
};
