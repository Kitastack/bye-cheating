import { MinimalLayout } from "@/components/layout/MinimalLayout";
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "@tanstack/react-router";

export function LoginPage() {
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
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[A-Z])[A-Za-z\d]{8,}$/.test(value)
          ? null
          : "At least 8 chars and contain at least 1 uppercase",
    },
  });

  return (
    <Paper radius={"md"} p={"xl"} withBorder>
      <Text size="lg" w={300} fw={500}>
        Selamat datang di Bye Cheating!
      </Text>
      <Group grow></Group>
      <Divider my={"md"} />
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          <TextInput
            required
            label="email"
            placeholder="nama@email.com"
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            value={form.values.email}
            error={form.errors.email}
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            onChange={(e) =>
              form.setFieldValue("password", e.currentTarget.value)
            }
            value={form.values.password}
            error={form.errors.password}
          />
        </Stack>
        <Group justify="space-between" mt={"xl"}>
          {/* <Anchor
            component="button"
            type="button"
            variant="text"
            onClick={() => navigate({ to: "/register" })}
            size="xs"
          >
            Tidak memiliki akun? Register
          </Anchor> */}
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Paper>
  );
}
