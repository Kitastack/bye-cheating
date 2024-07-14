import React, { createContext, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

interface IAuthContext {
  login: (email: string, password: string) => void;
  logout: () => void;
}

const KEY_ACCESS_TOKEN = "storage_access_token";
const KEY_REFRESH_TOKEN = "storage_refresh_token";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage(KEY_ACCESS_TOKEN, "");
  const [refreshToken, setRefreshToken] = useLocalStorage(
    KEY_REFRESH_TOKEN,
    "",
  );
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const data: IAuthContext = useMemo(
    () => ({
      async login(email, password) {
        //TODO: fetch login, save tokens, and navigate to `/app`
        const result = await fetch("http://localhost:8889/v1/camera", {
          method: "GET",
          keepalive: true,
          body: JSON.stringify({ email, password }),
        });
        console.log(result.statusText);
      },
      logout() {
        setAccessToken("");
        setRefreshToken("");
        navigate("/", { replace: true });
      },
    }),
    [accessToken, refreshToken],
  );

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext) as IAuthContext;
