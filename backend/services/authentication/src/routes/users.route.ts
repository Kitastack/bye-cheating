import { Hono } from "hono";
import { getUsers, createUser, loginUser } from "@controllers/index";
import { isAdmin, validation } from "@middlewares/index";
import { validator } from "hono/validator";

const users = new Hono();

// todo:get All Users
// users.get("/", validation, isAdmin, getUsers);
users.get("/", getUsers);

// todo:get Single User
users.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ message: `User ${id}` });
});

// todo:create User
users.post(
  "/",
  validator("json", (value, c) => {
    const errors = [];
    const name = value?.name;
    const email = value?.email;
    const password = value?.password;

    try {
      if (!name || typeof name !== "string") {
        errors.push("nama belum diisi");
      }

      if (!email || typeof email !== "string") {
        errors.push("email belum diisi");
      }

      if (!password || typeof password !== "string") {
        errors.push("password belum diisi");
      }

      if (errors?.length > 0) {
        throw new Error(errors.toString());
      }

      return value;
    } catch (error: any) {
      return c.json(
        {
          success: false,
          message: error?.message || "periksa kembali data user",
        },
        400
      );
    }
  }),
  createUser
);

// todo:login User
users.post("/login", loginUser);

export default users;
