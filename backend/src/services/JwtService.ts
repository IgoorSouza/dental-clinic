import jwt from "jsonwebtoken";
import User from "../types/user";

export default class JwtService {
  private static jwtSecret: string = process.env.JWT_SECRET!;

  static generateToken(user: User): string {
    return jwt.sign(user, this.jwtSecret, { expiresIn: "7d" });
  }

  static verifyToken(token: string): User {
    return jwt.verify(token, this.jwtSecret) as User;
  }
}
