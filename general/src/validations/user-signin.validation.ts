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

class UserSignIn {
  @IsNotEmpty({
    message: message.required,
  })
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty({
    message: message.required,
  })
  @IsString()
  @MinLength(8, {
    message: message.length,
  })
  password: string;
}

export default async function UserSignInValidation(
  req: Request
): Promise<IResponValidator<UserSignIn>> {
  const user: UserSignIn = new UserSignIn();
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
