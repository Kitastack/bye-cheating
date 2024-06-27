import { IUser } from "@models/users.model";
import { decode, sign, verify } from "hono/jwt";

const generateToken = (_id: string, _payload: IUser) => {
  return sign(
    {
      ...(_payload || {}),
      _id,
    },
    Bun.env.JWT_SECRET as string
  );
};

export { generateToken };
