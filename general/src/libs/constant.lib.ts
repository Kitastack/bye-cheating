// roles
const Admin = 'Admin'
const Developer = 'Developer'
export const ROLE_TYPE = [Developer, Admin] as const
export const ROLE = {
  Developer,
  Admin
}
