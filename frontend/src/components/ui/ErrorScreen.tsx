import { Center, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface ErrorScreenProps {
  topSlot?: JSX.Element;
  text: string;
  bottomSlot?: JSX.Element;
}

/**
 * Display error screen
 *
 * @returns
 */
export function ErrorScreen({ topSlot, bottomSlot, text }: ErrorScreenProps) {
  return (
    <Center miw={"100%"} mih={"100%"} style={{ flexGrow: "1" }}>
      <Stack align="center">
        {topSlot ? topSlot : <IconAlertCircle />}
        <Text>{text}</Text>
        {bottomSlot ? bottomSlot : null}
      </Stack>
    </Center>
  );
}
