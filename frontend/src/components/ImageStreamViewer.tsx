import { useEffect, useState } from "react";

const getBlobUrl = (data: any) => {
  if (data) {
    return `data:image/jpeg;base64, ${data}`;
  }
  return;
};

export function ImageStreamViewer({
  socketEvent,
}: {
  socketEvent: MessageEvent<any> | null;
}) {
  const [base64String, setBase64String] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    setBase64String(getBlobUrl(socketEvent?.data));
    console.log(`sizedata: ${base64String}`);
  }, [socketEvent]);
  return (
    <div className="flex justify-center">
      <div className="border-4 border-solid min-w-[640px] aspect-video rounded-lg flex place-content-center mt-5 px-10">
        {base64String ? (
          <img src={base64String} alt="CCTV Stream" />
        ) : (
          <h1 className="place-content-center text-2xl bg-slate-400 mx-auto my-auto px-7 py-2 rounded-lg bg-opacity-30">
            Tidak Ada Video CCTV
          </h1>
        )}
      </div>
    </div>
  );
}
