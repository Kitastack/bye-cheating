import { Avatar, Button, Divider, Flex, Text, Title } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";


export function ProfilePage() {
    return (
        <Flex direction={"column"} gap={"sm"} p={"xs"} align={"center"} w={"100%"}>
            <Title>Profile</Title>
            <Avatar src={""} size={128}/>
            <Title order={2}>Full Name</Title>
            <Text>Full email</Text>
            <Divider/>

            <Button variant="outline" color="red" rightSection={<IconLogout/>} >Logout</Button>
        </Flex>
    )
}