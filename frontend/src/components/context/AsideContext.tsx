import { Center, Text } from "@mantine/core";
import React, { createContext, useContext, useState } from "react";

interface IAsideContext {
  asideComponent: React.ReactNode;
  setAsideComponent: (component?: React.ReactNode) => void;
}

export const asideContextNullable = createContext<IAsideContext | undefined>(undefined);

export const useAside = () =>
  useContext(asideContextNullable) as IAsideContext;

export function AsideContextProvider({ children }: { children: JSX.Element }) {
  const [aside, setAside] = useState<React.ReactNode>(
    <Center w={"100%"} h={"100%"}>
      <Text>Empty</Text>
    </Center>
  );
  function setAsideComponent(component?: React.ReactNode) {
    setAside(
      component ?? (
        <Center w={"100%"} h={"100%"}>
          <Text>Empty</Text>
        </Center>
      )
    );
  }
  return (
    <asideContextNullable.Provider
      value={{ asideComponent: aside, setAsideComponent: setAsideComponent }}
    >
      {children}
    </asideContextNullable.Provider>
  );
}

