import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";



export function UserCardInfo({active, onClick}:{active: boolean, onClick: () => void}) {
  return (
    <UnstyledButton style={{
      outline: active ? "solid 2px var(--mantine-color-myColor-6)" : "solid 1px transparent",
      outlineOffset: "-2px",
      borderColor: "var(--mantine-color-myColor-6)",
    }} onClick={onClick}>
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
