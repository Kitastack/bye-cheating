import { Button, Divider, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
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
    <div className="border-2 rounded-md p-4 flex flex-col gap-4 w-96">
      <Flex justify={"center"}>
        <h1 className="text-2xl font-bold">Login</h1>
      </Flex>
      <form
        className="flex flex-col gap-2 min-h-96"
        onSubmit={form.onSubmit((values) => console.log(values))}
      >
        <TextInput
          withAsterisk
          label="email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
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
          <Button type="submit">Login</Button>
          <Button
            onClick={() => navigate("/register", { replace: true })}
            variant="outline"
          >
            Create new account
          </Button>
        </Flex>
      </form>
    </div>
  );
}
