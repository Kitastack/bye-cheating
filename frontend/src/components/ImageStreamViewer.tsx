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
  minW,
}: {
  /**
   * Base64 image string, not include `data:image/jpeg;base64,`
   */
  base64Data?: string;
  error?: string;
  minW?: number;
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
      style={{ minWidth: minW ?? 600, minHeight: ((minW ?? 600) * 9) / 16 }}
      className={`resize overflow-auto aspect-video rounded-sm flex justify-center items-center`}
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
