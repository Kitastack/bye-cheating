import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { Box, Button } from "@mantine/core";
import {
  createRootRoute,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
  notFoundComponent: () => {
    const router = useRouter();
    return (
      <Box w={"100vw"} h={"100vh"}>
        <ErrorScreen
          text={"404 Not Found"}
          bottomSlot={
            <Button onClick={() => router.history.back()}>Back</Button>
          }
        />
      </Box>
    );
  },
});
