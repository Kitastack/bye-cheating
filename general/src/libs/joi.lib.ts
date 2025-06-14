import Joi, { ObjectSchema } from "joi";
import { BadRequestError } from "./error.lib";

export const isValidSchema = async (
  schema: ObjectSchema,
  body: any
): Promise<void> => {
  try {
    await schema
      // .keys({
      //   page: Joi.string().optional(),
      //   limit: Joi.string().optional(),
      // })
      .options({
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      })
      .validateAsync(body);
  } catch (error) {
    throw new BadRequestError(
      (error as any)?.details?.map((item: any) => item?.message)?.join(", ") ??
        (error as Error)?.message
    );
  }
};
