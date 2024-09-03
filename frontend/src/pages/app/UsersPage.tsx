import { ActionIcon, Center, Flex, Table, Text, Title } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

const sample:UserData[] = [];

type UserData = {
  id: string;
  username: string;
  email: string;
};

type UserListProps = {
  data: UserData[];
};

function UserLists(props: UserListProps) {
  return (
    <Table withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Username</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Aksi</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {props.data.length > 1 ? (
          props.data.map((element) => {
            return (
              <Table.Tr key={element.email}>
                <Table.Td>{element.username}</Table.Td>
                <Table.Td>{element.email}</Table.Td>
                <Table.Td>
                  <ActionIcon variant="transparent">
                    <IconEdit />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })
        ) : (
          <Center>
            <Text>Pengguna kosong</Text>
          </Center>
        )}
      </Table.Tbody>
    </Table>
  );
}

export default function UsersPage() {
  return (
    <>
      <Flex direction={"column"} gap={"xs"} p={"xs"} mah={"100vh"}>
        <Title order={2}>Akun Pengguna</Title>
        <UserLists data={sample} />
      </Flex>
    </>
  );
}
