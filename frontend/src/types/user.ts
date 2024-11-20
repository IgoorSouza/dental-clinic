import Role from "./role";

export default interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
}
