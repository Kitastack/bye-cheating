import { Button, Flex } from "@mantine/core";
import { ImageStreamViewer } from "./ImageStreamViewer";
import { useState } from "react";

type LiveCamProps = {
  rawCamData?: string;
  mlCamData?: string;
};

export function LiveCamComponent(props: LiveCamProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Flex style={{ position: "relative" }}>
      {visible ? (
        <ImageStreamViewer title="ML View" base64Data={props.mlCamData} />
      ) : (
        <ImageStreamViewer title="RAW View" base64Data={props.rawCamData} />
      )}
      <Button
        style={{ position: "absolute", right:0}}
        m={10}
        onClick={() => setVisible((prev) => !prev)}
        variant={visible ? "filled" : "light"}
      >
        toggle ML
      </Button>
    </Flex>
  );
}
