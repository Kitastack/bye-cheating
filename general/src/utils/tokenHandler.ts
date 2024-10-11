import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import database from "@config/prisma.db";

type userString = User | string;

type userOnly = User;

export const generateAccessToken = async (
  payload: User
): Promise<string | null> => {
  delete payload.password;
  await database.authentication.upsert({
    where: {
      id: payload.id,
    },
    create: {
      id: payload.id,
    },
    update: {
      updatedDate: new Date(),
    },
  });
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
  });
  return token;
};

export const generateRefreshToken = async (
  user: userString
): Promise<string | null> => {
  let userId: string = null;
  if (user.valueOf().hasOwnProperty("id")) {
    userId = (user as User).id;
  } else {
    userId = user as string;
  }

  const last_auth = await database.authentication.findFirst({
    where: {
      id: userId,
    },
  });
  if (!last_auth) {
    return null;
  }

  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME,
  });
  return token;
};
