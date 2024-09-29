import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import database from "@config/prisma.db";

export const generateAccessToken = async (payload: User) => {
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
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
  });
};

export const generateRefreshToken = async (userId: string) => {
  if (await database.authentication.findFirst()) {
  }
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME,
  });
};
