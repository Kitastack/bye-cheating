import { useAside } from "@/components/context/AsideContext";
import { Avatar, Button, Divider, Flex, Text, Title } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthManager } from "@/hooks/useAuthManager";

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuthManager();
  const { setAsideComponent } = useAside();
  useEffect(() => {
    setAsideComponent();
  }, []);
  return (
    <Flex direction={"column"} gap={"sm"} p={"xs"} align={"center"} w={"100%"}>
      <Title>Profile</Title>
      <Avatar src={""} size={128} />
      <Title order={2}>Full Name</Title>
      <Text>Full email</Text>
      <Divider />

      <Button
        onClick={() => {
          logout();
        }}
        variant="outline"
        color="red"
        rightSection={<IconLogout />}
      >
        Logout
      </Button>
    </Flex>
  );
}
