import bcrypt from "bcrypt";

export const generatePassword = async (password: string) => {
  try {
    const newPassword: string = await bcrypt
      .genSalt(12)
      .then((salt: string) => {
        return bcrypt.hash(password, salt).then((hash: string) => {
          return hash;
        });
      });
    if (!newPassword) throw new Error("Password no result");
    return newPassword;
  } catch (error) {
    throw error;
  }
};

export const validatePassword = async (
  provided_password: string,
  target_password: string
) => {
  try {
    if (
      !provided_password ||
      !target_password ||
      !(await bcrypt.compare(provided_password, target_password))
    ) {
      throw new Error("Password does not matched");
    }
  } catch (error) {
    throw error;
  }
};
