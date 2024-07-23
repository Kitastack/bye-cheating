import { Box, Group, Text } from "@mantine/core";

export default function Title({leftSection}:{leftSection: React.ReactNode}) {
  return (
    <>
      <Group h={"100%"} px={"md"}>
        {leftSection}
        <div className=" items-end">
          {/* dont forget add `/` like `/logo.png` to avoid missing asset */}
          <img src="/logo.png" className="w-24" /> 
        </div>
        <Box className="text-[#66ABB1] overflow-clip">
          <h1 className=" text-xl font-extrabold">BYE-CHEATING</h1>
          
          <Text visibleFrom="md" size="xs">
            Jaminan Integritas, Langkah Cerdas Mengawal Keadilan Akademik!
          </Text>
        </Box>
      </Group>
    </>
  );
}
