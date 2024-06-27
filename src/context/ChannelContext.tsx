import { ReactNode, createContext, useContext, useState } from "react";

interface CamChannelOptional {
  name?: string;
  source?: string;
  labelSource?: string;
}

interface CamChannel {
  name: string;
  source: string;
  labelSource: string;
}

export interface IChannelContext {
  addCamera: (name: string, source: string, labelSource: string) => void;
  updateCamera: (name: string, newData: CamChannelOptional) => void;
  removeCamera: (name: string) => void;
  camList: CamChannel[];
}

export const ChannelContext = createContext<IChannelContext | undefined>(undefined);

export function ChannelProvider({ children }: { children: ReactNode }) {
  
  const [camList, setCamList] = useState<CamChannel[]>([]);

  return (
    <ChannelContext.Provider
      value={{
        camList,
        addCamera(name, source, labelSource) {
          setCamList((prev) => [...prev, { name, source, labelSource }]);
        },
        removeCamera(name) {
          setCamList((prev) => {
            const newList = prev.filter((item) => item.name !== name);
            return newList;
          });
        },
        updateCamera(name, newData) {
          const updatedList = camList.map((cam) => {
            if (cam.name == name) {
              const newCam: CamChannel = {
                labelSource: newData.labelSource ?? cam.labelSource,
                name: newData.name ?? cam.name,
                source: newData.source ?? cam.source,
              };
              return newCam;
            }
            return cam;
          });
          setCamList(updatedList);
        },
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
}
