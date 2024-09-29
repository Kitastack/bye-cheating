import {
  IsString,
  IsNotEmpty,
  MinLength,
  validate,
  IsEmail,
  IsOptional,
} from "class-validator";
import { Request } from "express";
import { IResponValidator } from ".";
import { validationHandler } from "@utils/validationHandler";

const message = {
  required: "field required",
  string: "type must be a string",
  length: "must be at least 8 characters long",
};

class UserCreationSchema {
  @IsOptional()
  @IsString({
    message: message.string,
  })
  _id?: string;

  @IsNotEmpty({
    message: message.required,
  })
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty({
    message: message.required,
  })
  @IsString()
  username: string;

  @IsNotEmpty({
    message: message.required,
  })
  @IsString()
  @MinLength(8, {
    message: message.length,
  })
  password: string;
}

export default async function UserValidation(
  req: Request
): Promise<IResponValidator<UserCreationSchema>> {
  const user: UserCreationSchema = new UserCreationSchema();
  user._id = req.body._id;
  user.email = req.body.email;
  user.username = req.body.username;
  user.password = req.body.password;
  return {
    payload: user,
    validate: await validate(user, { validationError: { target: false } }).then(
      validationHandler
    ),
  };
}
