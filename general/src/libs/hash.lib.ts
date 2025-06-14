import { hash, compare, genSalt } from "bcrypt";

export const generatePassword = async (password: string) => {
  try {
    const newPassword: string = await genSalt(12).then(async (salt: string) => {
      return await hash(password, salt).then((hash: string) => {
        return hash;
      });
    });
    if (!newPassword) throw new Error("password no result");
    return newPassword;
  } catch (error) {
    throw error;
  }
};

export const validatePassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    const result = await compare(plainPassword, hashedPassword);
    console.log(result);
    if (!hashedPassword || !plainPassword || !result) {
      throw new Error();
    }
    return true;
  } catch {
    return false;
  }
};
