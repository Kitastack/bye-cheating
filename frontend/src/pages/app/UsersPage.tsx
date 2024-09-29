import { useAside } from "@/components/context/AsideContext";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect } from "react";

const sample: UserData[] = [
  {
    id: "3",
    username: "guest 1",
    email: "affinitas89@gmail.com",
  },
];

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
        {props.data.length >= 1 ? (
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

function UserFormInspector(): JSX.Element {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      name: "",
      password: "",
      avatar: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length > 7 ? null : "Invalid password"),
      name: (val) => (val.length > 0 ? null : "Name must not be empty"),
    },
  });
  return (
    <Stack p={12}>
      <Title order={5} >User Form</Title>
      <form onSubmit={form.onSubmit(val=> console.log(val))}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Your name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="Password"
          placeholder="your password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Box p={8} />
        <Button type="submit">Add User</Button>
      </form>
    </Stack>
  );
}

export default function UsersPage() {
  const { setAsideComponent } = useAside();
  useEffect(() => {
    setAsideComponent(<UserFormInspector />);
  }, []);
  return (
    <>
      <Flex direction={"column"} gap={"xs"} p={"xs"} mah={"100vh"}>
        <Title order={2}>Akun Pengguna</Title>
        <UserLists data={sample} />
      </Flex>
    </>
  );
}
