import {
  IsString,
  IsNotEmpty,
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
};

class StreamCreationSchema {
  @IsOptional()
  @IsString({
    message: message.string,
  })
  _id?: string;

  @IsNotEmpty({
    message: message.required,
  })
  @IsString()
  url: string;
}

export default async function StreamValidation(
  req: Request
): Promise<IResponValidator<StreamCreationSchema>> {
  const stream: StreamCreationSchema = new StreamCreationSchema();
  stream._id = req.body._id;
  stream.url = req.body.url;
  return {
    payload: stream,
    validate: await validate(stream, {
      validationError: { target: false },
    }).then(validationHandler),
  };
}
