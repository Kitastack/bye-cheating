import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { MdOutlineWarningAmber } from "react-icons/md";

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
}: {
  /**
   * Base64 image string, not include `data:image/jpeg;base64,`
   */
  base64Data?: string;
  error?: string;
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
      className={`overflow-auto aspect-video w-full rounded-sm flex justify-center items-center`}
    >
      {base64String ? (
        <img src={base64String} alt="CCTV Stream" />
      ) : (
        <p className="flex gap-2 justify-center items-center">
          {" "}
          <MdOutlineWarningAmber /> {error ?? "Masalah tidak diketahui"}
        </p>
      )}
    </Box>
  );
}
