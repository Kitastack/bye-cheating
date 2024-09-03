import { ErrorScreen } from "@/components/ui/ErrorScreen";
import MainLayout from "@/layout/MainLayout";
import { Button, Center } from "@mantine/core";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => (
    <MainLayout/>    
  ),
  notFoundComponent: () => {
    const router = useRouter()
    return (
      <Center>
        <ErrorScreen
          text={"404 Not Found"}
          bottomSlot={
            <Button onClick={() => router.history.back()}>Back</Button>
          }
        />

      </Center>
    )
  }
});
