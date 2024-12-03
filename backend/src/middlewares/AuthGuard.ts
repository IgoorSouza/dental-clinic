import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import JwtService from "../services/JwtService";
import User from "../interfaces/user";

export default class AuthGuard {
  static verifyAuthencation(
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    try {
      const token = request.headers.authorization?.replace("Bearer ", "");
      if (!token) throw new Error("Authentication required.");

      const user: User = JwtService.verifyToken(token);

      if (!AuthGuard.verifyRole(request.baseUrl, user.role)) {
        throw new Error("Insufficient permissions.");
      }

      next();
    } catch (error) {
      response
        .status(401)
        .send(
          "Authentication error: Invalid token or insufficient permissions."
        );
    }
  }

  private static verifyRole(requestUrl: string, role: string): boolean {
    if (requestUrl.includes("/users") && role === Role.ADMIN) {
      return false;
    }

    return true;
  }
}
