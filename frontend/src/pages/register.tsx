import { Button, Divider, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="w-full h-svh flex flex-col items-center justify-center">
      <LoginCard />
    </div>
  );
}

function LoginCard() {
  const navigate = useNavigate();
  const [passwordVisible, { toggle: togglePasswordVisibility }] =
    useDisclosure(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      name: (value) => (/^\S+$/.test(value) ? null : "Field is required"),
      password: (value) =>
        /^(?=.*[A-Z])[A-Za-z\d]{8,}$/.test(value)
          ? null
          : "At least 8 chars and contain at least 1 uppercase",
    },
  });

  return (
    <div className="border-2 rounded-md p-4 flex flex-col gap-4 w-96">
      <Flex justify={"center"}>
        <h1 className="text-2xl font-bold">Register</h1>
      </Flex>
      <form
        className="flex flex-col gap-2 min-h-96"
        onSubmit={form.onSubmit((values) => console.log(values))}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="Name"
          placeholder="your name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <PasswordInput
          withAsterisk
          label="password"
          visible={passwordVisible}
          onVisibilityChange={togglePasswordVisibility}
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <div className="flex-grow"></div>

        <Divider />
        <Flex direction={"column"} gap={"4px"}>
          <Button type="submit">Register</Button>
          <Button
            onClick={() => navigate("/login", { replace: true })}
            variant="outline"
          >
            Back to Login
          </Button>
        </Flex>
      </form>
    </div>
  );
}
