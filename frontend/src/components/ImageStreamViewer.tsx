import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";


export function ImageStreamViewer({
  source: source,
  error,
  title
}: {

  source?: string;
  error?: string;
  title?: string;
}) {
  const [imageSource, setImageSource] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setImageSource(source ?? "");
  }, [source]);
  return (
    <Box
      bd={"1px solid myColor.5"}
      className={`overflow-auto relative aspect-video w-full rounded-sm flex justify-center items-center`}
    >
      {imageSource ? (
        <img src={imageSource} alt="CCTV Stream" />
      ) : (
        <p className="flex gap-2 justify-center items-center">
          {" "}
          <IconAlertCircle /> {error ?? "Masalah tidak diketahui"}
        </p>
      )}
      <Text style={{position:"absolute", top:1, left:1}} m={10} c={"dimmed"}>{title}</Text>
    </Box>
  );
}
