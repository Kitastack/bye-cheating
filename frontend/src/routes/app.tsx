import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { AsideContextProvider } from "@/components/context/AsideContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button, Center } from "@mantine/core";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ImageStreamContextProvider } from "@/components/context/ImageStreamContext";

export const Route = createFileRoute("/app")({
  component: () => (
    <ImageStreamContextProvider>
      <AsideContextProvider>
        <MainLayout />
      </AsideContextProvider>
    </ImageStreamContextProvider>
  ),
  notFoundComponent: () => {
    const router = useRouter();
    return (
      <Center>
        <ErrorScreen
          text={"404 Not Found"}
          bottomSlot={
            <Button onClick={() => router.history.back()}>Back</Button>
          }
        />
      </Center>
    );
  },
});
