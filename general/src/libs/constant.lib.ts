// roles
const Admin = "Admin";
const Sandbox = "Sandbox";
export const ROLE_TYPE = [Sandbox, Admin] as const;
export const ROLE = {
  Sandbox,
  Admin,
};
