import { Role } from "@prisma/client";

type AuthData = {
  accessToken: string;
  email: string;
  role: Role;
  name: string;
};

export default AuthData;
