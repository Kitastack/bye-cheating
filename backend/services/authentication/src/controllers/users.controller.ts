import { Context } from "hono";
import { Users } from "@models/index";
import { generateToken } from "@utils/token";
import { randomUUID } from "node:crypto";
import { pagination } from "@utils/pagination";
import { errorHandler } from "@middlewares/error.middleware";
import queryParser from "@utils/queryParser";

/**
 * @api {get} /users Get All Users
 * @apiGroup users
 * @access private
 */
export const getUsers = async (c: Context) => {
  try {
    const query = queryParser(c.req.query("payload") as any);
    const result = await pagination(
      Users,
      [
        ...query?.aggregate,
        {
          $project: {
            password: 0,
          },
        },
      ],
      c.req.query("limit") as any,
      c.req.query("page") as any
    );

    return c.json({
      success: true,
      ...(result || {}),
    });
  } catch (error) {
    c.set("status", 500);
    return errorHandler(c);
  }
};

/**
 * @api {post} /users Create User
 * @apiGroup users
 * @access public
 */
export const createUser = async (c: Context) => {
  try {
    const { name, email, password } = await c.req.json();

    // todo:check for existing user
    const userExists = await Users.findOne({
      email: { $regex: email?.toLowerCase(), $options: "i" },
    });

    if (userExists) {
      c.status(400);
      throw new Error("User already exists");
    }

    const createUser = await Users.create({
      _id: randomUUID(),
      name,
      email,
      password,
    });

    if (!createUser) {
      c.status(400);
      throw new Error("Invalid user data");
    }

    const token = await generateToken(createUser?._id, createUser);

    return c.json({
      success: true,
      data: {
        _id: createUser._id,
        name: createUser.name,
        email: createUser.email,
        roles: createUser.roles,
      },
      token,
      message: "User created successfully",
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @api {post} /users/login Login User
 * @apiGroup users
 * @access public
 */
export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();

  // todo:check for existing user
  if (!email || !password) {
    c.status(400);
    throw new Error("Please provide an email and password");
  }

  const findUser = await Users.findOne({ email });
  if (!findUser) {
    c.status(401);
    throw new Error("No user found with this email");
  }

  if (!(await findUser.mathPassword(password))) {
    c.status(401);
    throw new Error("Invalid credentials");
  }

  const token = await generateToken(findUser._id, findUser);
  return c.json({
    message: "User logged in successfully",
    success: true,
    result: {
      token,
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      roles: findUser.roles,
    },
  });
};
