import { MinimalLayout } from "@/layout/MinimalLayout";
import {
  Anchor,
  Button,
  Divider,
  Text,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  return (
    <MinimalLayout>
      <div className="w-full h-svh flex flex-col items-center justify-center">
        <LoginCard />
      </div>
    </MinimalLayout>
  );
}

function LoginCard() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      repeatedPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      name: (value) => (/^\S+$/.test(value) ? null : "Field is required"),
      password: (value) =>
        /^(?=.*[A-Z])[A-Za-z\d]{8,}$/.test(value)
          ? null
          : "At least 8 chars and contain at least 1 uppercase",
      repeatedPassword: (value,e) =>
        value == e.password ? null : "Password harus sama",
    },
  });

  return (
    <Paper radius={"md"} p={"xl"} withBorder>
      <Text size="lg" w={300} fw={500}>
        Selamat Datang di Bye Cheating!
      </Text>
      <Group grow></Group>
      <Divider my={"md"} />
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          <TextInput
            required
            label={"Email"}
            placeholder="nama@email.com"
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            value={form.values.email}
            error={form.errors.email}
          />
          <TextInput
            required
            label={"Nama"}
            placeholder="Nama anda"
            onChange={(e) => {
              form.setFieldValue("name", e.currentTarget.value);
            }}
            value={form.values.name}
            error={form.errors.name}
          />
          <PasswordInput
            required
            label={"Password"}
            placeholder="Password anda"
            onChange={(e) =>
              form.setFieldValue("password", e.currentTarget.value)
            }
            value={form.values.password}
            error={form.errors.password}
          />
          <PasswordInput
            required
            label={"Ulangi Password"}
            placeholder="Password anda"
            onChange={(e) =>
              form.setFieldValue("repeatedPassword", e.currentTarget.value)
            }
            value={form.values.repeatedPassword}
            error={form.errors.repeatedPassword}
          />
        </Stack>
        <Group justify="space-between" mt={"xl"}>
          <Anchor
            component="button"
            type="button"
            variant="text"
            onClick={() => navigate("/login")}
            size="xs"
          >
            Sudah punya akun? Login
          </Anchor>
          <Button type="submit">Register</Button>
        </Group>
      </form>
    </Paper>
  );
}
