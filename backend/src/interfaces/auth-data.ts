import { Role } from "@prisma/client";

export default interface AuthData {
  accessToken: string;
  email: string;
  role: Role;
  name: string;
};
