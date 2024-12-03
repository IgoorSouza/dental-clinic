import { Role } from "@prisma/client";

export default interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
