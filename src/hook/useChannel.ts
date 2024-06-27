import { useEffect, useState } from "react";
// import {} from ""
function useChannel(channel: string) {
  const [currentSteamImg, setCurrentStreamImg] = useState("");
  const [timer, setTimer] = useState<number | undefined>();

  useEffect(() => {
    setTimer(
      setInterval(() => {
        //TODO: run fetching here
      }, 500)
    );
    return () => {
      clearInterval(timer);
      setTimer(undefined);
    };
  });
}
