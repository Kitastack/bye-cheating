import { BASE_URL } from "@/constant";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";

const KEY = "key";
const USER = "user";

export const useAuthManager = () => {
  const navigate = useNavigate();

  async function logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER);
    notifications.show({
      title: "Logout successful",
      message: "Goodbye",
      color: "green",
    });
    navigate({ to: "/login", replace: true });
  }
  async function getAccessToken() {
    const data = localStorage.getItem(KEY);
    const key = JSON.parse(data as string).accessToken;
    if (key && typeof key === "string") {
      return key as string;
    }
    return
}

  async function submitLogin(email: string, password: string) {
    const body = {
      email: email,
      password: password,
    };
    
    const response = await fetch(`${BASE_URL}/authentication/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      localStorage.setItem(KEY, JSON.stringify(data.result.key));
      notifications.show({
        title: "Login successful",
        message: "Welcome back",
        color: "green",
      });
      delete data.result.key;
      localStorage.setItem(USER, JSON.stringify(data.result));
      return navigate({ to: "/app", replace: true });
    }
    notifications.show({
      title: "Login failed",
      message: "Please check your credentials",
      color: "red",
    });
    console.error("Login failed", response.statusText);
    return;
  }
  return { submitLogin, logout, getAccessToken};
};
