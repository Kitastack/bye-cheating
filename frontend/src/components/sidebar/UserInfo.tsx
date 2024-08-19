import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";



export function UserCardInfo() {
  return (
    <UnstyledButton style={{}} onClick={() => {}}>
      <Group wrap="nowrap" p={"xs"}>
        <Avatar size={48} radius={"md"} />
        <div>
          <Text fz={"xs"} tt={"uppercase"} fw={"bold"} c={"dimmed"}>
            my@email.com
          </Text>
          <Text fz={"sm"} fw={"normal"}>
            Agung Adhinata
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
