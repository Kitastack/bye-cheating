import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/constant";
import { notifications } from "@mantine/notifications";

type IAuthContext = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    name: string,
    password: string,
    repeatedPassword: string
  ) => Promise<void>;
};

const KEY_ACCESS_TOKEN = "storage_access_token";
const KEY_REFRESH_TOKEN = "storage_refresh_token";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage(KEY_ACCESS_TOKEN, "");
  const [refreshToken, setRefreshToken] = useLocalStorage(
    KEY_REFRESH_TOKEN,
    ""
  );
  const navigate = useNavigate();

  const data: IAuthContext = useMemo(
    () => ({
      async login(email, password) {
        //TODO: fetch login, save tokens, and navigate to `/app`
        const result = await fetch(`${BASE_URL}/v1/login`, {
          method: "GET",
          keepalive: true,
          body: JSON.stringify({ email, password }),
        }).catch(e=> console.log(e));
        if(!result) return
        console.log(result.statusText);
      },
      logout() {
        setAccessToken("");
        setRefreshToken("");
        navigate("/", { replace: true });
      },
      async register(
        email: string,
        name: string,
        password: string,
        repeatedPassword: string
      ) {
        const result = await fetch(`${BASE_URL}/v1/register`, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            name: name,
            password: password,
            repeatedPassword: repeatedPassword,
          }),
        }).catch((e) => console.log(e));
        
        if (!result) return;

        console.log(result.statusText);
        notifications.show({
          message: result.statusText,
          title: "Register Status",
        });
      },
    }),
    [accessToken, refreshToken]
  );

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext) as IAuthContext;
