import {
  ActionIcon,
  ActionIconGroup,
  Flex,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import {IconMoon, IconSun} from "@tabler/icons-react"

export default function TitleDashboard({
  leftSection,
}: {
  leftSection: React.ReactNode;
}) {

  const {colorScheme, setColorScheme } = useMantineColorScheme({keepTransitions:true})
  return (
    <>
      <Flex h={"100%"} align={"center"} px={"md"} pr={48}>
        {leftSection}
        <Flex align={"center"} className="flex-grow">
          <div className=" items-end">
            {/* dont forget add `/` like `/logo.png` to avoid missing asset */}
            <img src="/logo.png" className="w-24" />
          </div>
          <Stack gap={"xs"} className="text-[#66ABB1] overflow-clip">
            <h1 className=" text-2xl font-extrabold">BYE-CHEATING</h1>
            <Text visibleFrom="md" fw={"normal"} size="xs">
              Jaminan Integritas, Langkah Cerdas Mengawal Keadilan Akademik!
            </Text>
          </Stack>
        </Flex>
        <ActionIconGroup>
          <ActionIcon variant={colorScheme ==="light" ? "filled" : "light"} size={"xl"} onClick={()=> setColorScheme("light")}>
            <IconSun size={20} />
          </ActionIcon>
          <ActionIcon variant={colorScheme ==="dark" ? "filled" : "light"} size={"xl"} onClick={()=> setColorScheme("dark")}>
            <IconMoon size={20} />
          </ActionIcon>
        </ActionIconGroup>
      </Flex>
    </>
  );
}
