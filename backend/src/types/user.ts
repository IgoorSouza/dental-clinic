import { Role } from "@prisma/client";

type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export default User;
