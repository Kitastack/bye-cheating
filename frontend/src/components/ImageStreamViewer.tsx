import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";

// const getBlobUrl = (data: string | null) => {
//   if (data) {
//     return `data:image/jpeg;base64, ${data}`;
//   }
//   return;
// };
//todo: create error handling like result, error, and loading.
export function ImageStreamViewer({
  base64Data,
  error,
  title
}: {
  /**
   * Base64 image string, not include `data:image/jpeg;base64,`
   */
  base64Data?: string;
  error?: string;
  title?: string;
}) {
  const [base64String, setBase64String] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setBase64String(base64Data ?? "");
  }, [base64Data]);
  return (
    <Box
      bd={"1px solid myColor.5"}
      className={`overflow-auto relative aspect-video w-full rounded-sm flex justify-center items-center`}
    >
      {base64String ? (
        <img src={base64String} alt="CCTV Stream" />
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
